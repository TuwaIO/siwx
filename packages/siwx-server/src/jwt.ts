/**
 * @file JWTs for SIWX sessions, so services that accept a sign-in only as a JWT verified with public keys (embedded
 * wallet providers with custom authentication such as Coinbase CDP, identity platforms, your own services) can trust a
 * wallet sign-in. Web Crypto API only.
 */

import { formatCaip10AccountId, parseCaip10AccountId } from '@tuwaio/orbit-core';
import { normalizeSolanaChainId } from '@tuwaio/siwx-core';

import { base64UrlToBytes, base64UrlToUtf8, bytesToBase64Url, utf8ToBase64Url } from './encoding';
import { SIWX_JWT_ALGORITHMS, siwxJwtAlgorithmOf } from './jwtKeys';
import type { SiwxJwks, SiwxJwtKey, SiwxJwtPayload, SiwxPublicJwk, SiwxSession } from './types';

/** Default token lifetime in seconds (10 minutes). */
const DEFAULT_TTL_SECONDS = 600;

/** Longest token lifetime in seconds (7 days, the limit of Coinbase CDP custom authentication). */
const MAX_TTL_SECONDS = 604_800;

/** Claims written by SIWX that `claims` may not set. */
const RESERVED_CLAIMS = new Set(['iss', 'sub', 'aud', 'iat', 'exp', 'nbf', 'jti', 'caip10', 'chain_id']);

/**
 * Reads the CAIP-10 account of a session with `parseCaip10AccountId` of `@tuwaio/orbit-core`.
 * @throws {TypeError} If the session address is not a CAIP-10 account ID.
 */
function sessionAccount(session: SiwxSession): { chainId: string; namespace: string; address: string } {
  const account = parseCaip10AccountId(session.address);
  if (!account) {
    throw new TypeError(`[SIWX-SERVER] The session address is not a CAIP-10 account ID: "${session.address}".`);
  }
  return account;
}

/**
 * Returns the default `sub` of the JWT of a session: a stable ID of the user, so that signing in on another network
 * does not look like another user to the service that receives the token.
 *
 * - `subjectId`, when set and not empty (your own user ID, bound with `SiwxSessionStore.bindSubject`);
 * - otherwise the account without its chain reference: `eip155:<address in lowercase>` for EVM,
 *   `solana:<address>` for Solana (base58 is case-sensitive and kept as is), `<namespace>:<address>` otherwise.
 *
 * Pure function.
 *
 * @param session - The session of the signed-in wallet.
 * @param subjectId - The user ID bound to the session, if any.
 * @returns The subject.
 * @throws {TypeError} If `subjectId` is not set and the session address is not a CAIP-10 account ID.
 *
 * @example
 * ```ts
 * siwxJwtSubject({ ...session, address: 'eip155:8453:0xAbC…' }); // "eip155:0xabc…"
 * ```
 */
export function siwxJwtSubject(session: SiwxSession, subjectId?: string): string {
  if (subjectId) return subjectId;
  const { namespace, address } = sessionAccount(session);
  return `${namespace}:${namespace === 'eip155' ? address.toLowerCase() : address}`;
}

/**
 * Signs a JWT for a SIWX session with ES256 or RS256 (Web Crypto API).
 *
 * The header is `{ alg, kid, typ: "JWT" }`. The claims are `iss`, `sub`, `aud` (when set), `iat`, `exp`, `jti` (16
 * random bytes), `caip10` and `chain_id` (with Solana chain IDs in their genesis-hash form), plus `claims`. `exp` is
 * the earliest of `now + ttlSeconds`, `notAfter` and the `expirationTime` of the signed message, so a token never
 * outlives its session.
 *
 * Side effects: reads the clock (unless `now` is set) and the random number generator.
 *
 * @param params - The session, the key and the claims.
 * @param params.session - The verified session of the signed-in wallet.
 * @param params.key - The signing key, from `importSiwxJwtKey`.
 * @param params.issuer - The `iss` claim: the URL of your app. The receiving service checks it.
 * @param params.audience - The `aud` claim, when the receiving service expects one.
 * @param params.ttlSeconds - Token lifetime in seconds, from 1 to 604800 (7 days). Defaults to 600.
 * @param params.subject - The `sub` claim. Defaults to {@link siwxJwtSubject} of the session.
 * @param params.claims - Extra claims. `iss`, `sub`, `aud`, `iat`, `exp`, `nbf`, `jti`, `caip10` and `chain_id` are
 * reserved.
 * @param params.notAfter - Latest expiry in milliseconds since the epoch, for example the expiry of the session record.
 * @param params.now - Current time in milliseconds since the epoch. Defaults to `Date.now()`.
 * @returns The compact JWT and its expiry in milliseconds since the epoch.
 * @throws {TypeError} If `issuer` is empty, `claims` sets a reserved claim or the session address is not a CAIP-10
 * account ID.
 * @throws {RangeError} If `ttlSeconds` is not an integer from 1 to 604800, or the session expires within the current
 * second.
 *
 * @example
 * ```ts
 * const { token } = await signSiwxJwt({ session, key, issuer: 'https://app.example.com' });
 * ```
 */
export async function signSiwxJwt(params: {
  session: SiwxSession;
  key: SiwxJwtKey;
  issuer: string;
  audience?: string | string[];
  ttlSeconds?: number;
  subject?: string;
  claims?: Record<string, unknown>;
  notAfter?: number;
  now?: number;
}): Promise<{ token: string; expiresAt: number }> {
  const { session, key, issuer, audience, subject, claims, notAfter } = params;
  const ttlSeconds = params.ttlSeconds ?? DEFAULT_TTL_SECONDS;
  const now = params.now ?? Date.now();

  assertSiwxJwtSettings(issuer, ttlSeconds);
  const account = sessionAccount(session);
  for (const claim of Object.keys(claims ?? {})) {
    if (RESERVED_CLAIMS.has(claim)) {
      throw new TypeError(`[SIWX-SERVER] The claim "${claim}" is set by SIWX and cannot be overridden.`);
    }
  }

  const limits = [now + ttlSeconds * 1000];
  if (notAfter !== undefined) limits.push(notAfter);
  if (session.expirationTime) limits.push(Date.parse(session.expirationTime));
  const iat = Math.floor(now / 1000);
  const exp = Math.floor(Math.min(...limits) / 1000);
  if (!(exp > iat)) {
    throw new RangeError('[SIWX-SERVER] The session expires before a token can be issued.');
  }

  const payload: SiwxJwtPayload = {
    ...claims,
    iss: issuer,
    sub: subject ?? siwxJwtSubject(session),
    ...(audience === undefined ? {} : { aud: audience }),
    iat,
    exp,
    jti: bytesToBase64Url(globalThis.crypto.getRandomValues(new Uint8Array(16))),
    caip10: formatCaip10AccountId(account.chainId, account.address) ?? session.address,
    chain_id: normalizeSolanaChainId(session.chainId),
  };

  const signingInput = `${utf8ToBase64Url(JSON.stringify({ alg: key.alg, kid: key.kid, typ: 'JWT' }))}.${utf8ToBase64Url(JSON.stringify(payload))}`;
  const signature = await globalThis.crypto.subtle.sign(
    SIWX_JWT_ALGORITHMS[key.alg].signParams,
    key.privateKey,
    new TextEncoder().encode(signingInput),
  );
  return { token: `${signingInput}.${bytesToBase64Url(new Uint8Array(signature))}`, expiresAt: exp * 1000 };
}

/**
 * Verifies a JWT issued by {@link signSiwxJwt}, for services that receive the token instead of the session cookie.
 *
 * Checks, in order: three base64url parts with JSON header and payload; header `alg` is `ES256` or `RS256` (`none` is
 * rejected), `typ` is `JWT` when present and `kid` is present; a key with that `kid` exists in `jwks` and has the
 * same algorithm; the signature; `iss` equals `issuer`; `aud` contains one of `audience` when `audience` is set;
 * `exp` has not passed and `iat` is not in the future, both with `clockSkewSeconds`; `sub` is a non-empty string.
 *
 * Never throws: every failure returns `null`. Side effects: reads the clock unless `now` is set.
 *
 * @param token - The compact JWT.
 * @param params - The keys and the expected claims.
 * @param params.jwks - The JWKS (as served by `/jwks` or built with `createSiwxJwks`), or an array of signing keys
 * and/or public JWKs.
 * @param params.issuer - The expected `iss`.
 * @param params.audience - The expected audience. When set, the token must carry an `aud` containing one of them.
 * @param params.clockSkewSeconds - Tolerance for `exp` and `iat` in seconds. Defaults to 60.
 * @param params.now - Current time in milliseconds since the epoch. Defaults to `Date.now()`.
 * @returns The claims of a valid token, or `null`.
 *
 * @example
 * ```ts
 * const jwks = await (await fetch('https://app.example.com/api/siwx/jwks')).json();
 * const claims = await verifySiwxJwt(token, { jwks, issuer: 'https://app.example.com' });
 * if (!claims) return new Response('Unauthorized', { status: 401 });
 * ```
 */
export async function verifySiwxJwt(
  token: string,
  params: {
    jwks: SiwxJwks | { keys: ReadonlyArray<JsonWebKey> } | ReadonlyArray<SiwxJwtKey | SiwxPublicJwk>;
    issuer: string;
    audience?: string | string[];
    clockSkewSeconds?: number;
    now?: number;
  },
): Promise<SiwxJwtPayload | null> {
  try {
    if (typeof token !== 'string') return null;
    const parts = token.split('.');
    if (parts.length !== 3) return null;
    const [headerPart, payloadPart, signaturePart] = parts;

    const header: unknown = JSON.parse(base64UrlToUtf8(headerPart));
    const payload: unknown = JSON.parse(base64UrlToUtf8(payloadPart));
    if (!isRecord(header) || !isRecord(payload)) return null;

    const alg = header.alg;
    if (alg !== 'ES256' && alg !== 'RS256') return null;
    if (header.typ !== undefined && header.typ !== 'JWT') return null;
    if (typeof header.kid !== 'string' || header.kid.length === 0) return null;

    const candidates: ReadonlyArray<SiwxJwtKey | SiwxPublicJwk | JsonWebKey> = Array.isArray(params.jwks)
      ? params.jwks
      : (params.jwks as { keys: ReadonlyArray<JsonWebKey> }).keys;
    const jwk = candidates
      .map((key) => ('privateKey' in key ? key.publicJwk : key))
      .find((key) => (key as { kid?: unknown }).kid === header.kid) as JsonWebKey | undefined;
    if (!jwk || siwxJwtAlgorithmOf(jwk) !== alg || (jwk.alg !== undefined && jwk.alg !== alg)) return null;

    const signature = base64UrlToBytes(signaturePart);
    if (alg === 'ES256' && signature.length !== 64) return null;
    const publicKey = await globalThis.crypto.subtle.importKey(
      'jwk',
      alg === 'ES256' ? { kty: 'EC', crv: 'P-256', x: jwk.x, y: jwk.y } : { kty: 'RSA', n: jwk.n, e: jwk.e },
      SIWX_JWT_ALGORITHMS[alg].importParams,
      false,
      ['verify'],
    );
    const valid = await globalThis.crypto.subtle.verify(
      SIWX_JWT_ALGORITHMS[alg].signParams,
      publicKey,
      signature,
      new TextEncoder().encode(`${headerPart}.${payloadPart}`),
    );
    if (!valid) return null;

    const nowSeconds = (params.now ?? Date.now()) / 1000;
    const skew = params.clockSkewSeconds ?? 60;
    if (payload.iss !== params.issuer) return null;
    if (typeof payload.sub !== 'string' || payload.sub.length === 0) return null;
    if (typeof payload.exp !== 'number' || nowSeconds > payload.exp + skew) return null;
    if (typeof payload.iat !== 'number' || payload.iat > nowSeconds + skew) return null;
    if (params.audience !== undefined) {
      const expected = Array.isArray(params.audience) ? params.audience : [params.audience];
      const actual = Array.isArray(payload.aud) ? payload.aud : [payload.aud];
      if (!actual.some((aud) => typeof aud === 'string' && expected.includes(aud))) return null;
    }
    return payload as SiwxJwtPayload;
  } catch {
    return null;
  }
}

/** `true` for a plain object (not `null`, not an array). */
function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

/**
 * Checks the issuer and the token lifetime of the JWT settings.
 * @throws {TypeError} If `issuer` is empty.
 * @throws {RangeError} If `ttlSeconds` is not an integer from 1 to 604800.
 * @internal
 */
export function assertSiwxJwtSettings(issuer: string, ttlSeconds: number): void {
  if (typeof issuer !== 'string' || issuer.length === 0) {
    throw new TypeError('[SIWX-SERVER] The JWT issuer must be a non-empty string, for example your app URL.');
  }
  if (!Number.isInteger(ttlSeconds) || ttlSeconds < 1 || ttlSeconds > MAX_TTL_SECONDS) {
    throw new RangeError(`[SIWX-SERVER] The JWT ttlSeconds must be an integer from 1 to ${MAX_TTL_SECONDS}.`);
  }
}
