/**
 * @file JWT signing keys for SIWX sessions: generation, import, RFC 7638 thumbprints and the JWKS. Web Crypto API
 * only, so it runs on Node.js 20+, Edge runtimes, Bun and Deno.
 */

import { base64UrlToBytes, bytesToBase64Url } from './encoding';
import type { SiwxJwks, SiwxJwtAlgorithm, SiwxJwtKey, SiwxPublicJwk } from './types';

/**
 * Web Crypto parameters of each supported algorithm.
 * @internal
 */
export const SIWX_JWT_ALGORITHMS: Record<
  SiwxJwtAlgorithm,
  { importParams: EcKeyImportParams | RsaHashedImportParams; signParams: EcdsaParams | Algorithm }
> = {
  ES256: {
    importParams: { name: 'ECDSA', namedCurve: 'P-256' },
    signParams: { name: 'ECDSA', hash: 'SHA-256' },
  },
  RS256: {
    importParams: { name: 'RSASSA-PKCS1-v1_5', hash: 'SHA-256' },
    signParams: { name: 'RSASSA-PKCS1-v1_5' },
  },
};

/** Smallest RSA modulus accepted, in bits. */
const MIN_RSA_BITS = 2048;

/** JWK members that restrict how Web Crypto may use a key, removed before import. */
const USAGE_MEMBERS = ['key_ops', 'ext', 'use'] as const;

/**
 * The algorithm of a JWK: `ES256` for an EC P-256 key, `RS256` for an RSA key.
 * @throws {TypeError} For any other key type or curve.
 * @internal
 */
export function siwxJwtAlgorithmOf(jwk: JsonWebKey): SiwxJwtAlgorithm {
  if (jwk.kty === 'EC' && jwk.crv === 'P-256') return 'ES256';
  if (jwk.kty === 'RSA') return 'RS256';
  throw new TypeError(
    `[SIWX-SERVER] Unsupported JWT key: kty ${String(jwk.kty)}${jwk.crv ? `, crv ${jwk.crv}` : ''}. Use an EC P-256 key (ES256) or an RSA key (RS256).`,
  );
}

/**
 * Builds the public JWK (no private members) of a key, with its `alg`, `kid` and `use`.
 * @internal
 */
export function toSiwxPublicJwk(jwk: JsonWebKey, alg: SiwxJwtAlgorithm, kid: string): SiwxPublicJwk {
  if (alg === 'ES256') {
    return { kty: 'EC', crv: 'P-256', x: jwk.x, y: jwk.y, alg, kid, use: 'sig' };
  }
  return { kty: 'RSA', n: jwk.n, e: jwk.e, alg, kid, use: 'sig' };
}

/**
 * Computes the RFC 7638 thumbprint of a key: SHA-256 over the required public members in lexicographic order
 * (`crv`, `kty`, `x`, `y` for EC; `e`, `kty`, `n` for RSA), base64url. SIWX uses it as the `kid` of a key.
 *
 * @param jwk - A public or private JWK of an EC or RSA key.
 * @returns The thumbprint, 43 base64url characters.
 * @throws {TypeError} If the key is neither EC nor RSA, or a required member is missing.
 */
export async function siwxJwkThumbprint(jwk: SiwxPublicJwk | JsonWebKey): Promise<string> {
  let canonical: string;
  if (jwk.kty === 'EC' && jwk.crv && jwk.x && jwk.y) {
    canonical = JSON.stringify({ crv: jwk.crv, kty: jwk.kty, x: jwk.x, y: jwk.y });
  } else if (jwk.kty === 'RSA' && jwk.e && jwk.n) {
    canonical = JSON.stringify({ e: jwk.e, kty: jwk.kty, n: jwk.n });
  } else {
    throw new TypeError('[SIWX-SERVER] A JWK thumbprint needs an EC key with crv, x and y or an RSA key with e and n.');
  }
  const digest = await globalThis.crypto.subtle.digest('SHA-256', new TextEncoder().encode(canonical));
  return bytesToBase64Url(new Uint8Array(digest));
}

/**
 * Generates a new JWT signing key. Run it once, store `privateJwk` as a secret (for example the environment variable
 * read by {@link importSiwxJwtKey}) and never expose it to the browser.
 *
 * @param alg - `ES256` (P-256, default) or `RS256` (2048-bit modulus, exponent 65537).
 * @returns The private JWK to store, the public JWK and its `kid`.
 */
export async function generateSiwxJwtKey(
  alg: SiwxJwtAlgorithm = 'ES256',
): Promise<{ privateJwk: JsonWebKey; publicJwk: SiwxPublicJwk; kid: string }> {
  const params =
    alg === 'ES256'
      ? { name: 'ECDSA', namedCurve: 'P-256' }
      : {
          name: 'RSASSA-PKCS1-v1_5',
          modulusLength: MIN_RSA_BITS,
          publicExponent: new Uint8Array([1, 0, 1]),
          hash: 'SHA-256',
        };
  const pair = (await globalThis.crypto.subtle.generateKey(params, true, ['sign', 'verify'])) as CryptoKeyPair;
  const exported = await globalThis.crypto.subtle.exportKey('jwk', pair.privateKey);
  const privateJwk = withoutUsageMembers({ ...exported, alg });
  const kid = await siwxJwkThumbprint(privateJwk);
  return { privateJwk, publicJwk: toSiwxPublicJwk(privateJwk, alg, kid), kid };
}

/**
 * Imports the private key that signs the JWTs of SIWX sessions.
 *
 * Accepted forms of `privateKey`:
 * - a JWK object, or its JSON string (as stored by {@link generateSiwxJwtKey});
 * - a PKCS#8 PEM (`-----BEGIN PRIVATE KEY-----`). Line breaks may be real, `\r\n` or the two characters `\n`, as
 *   environment variables often store them. Without `alg`, an EC P-256 key is tried first, then RSA.
 *
 * The `use`, `key_ops` and `ext` members of a JWK are ignored. The imported private key is not extractable.
 *
 * @param params - The key and, optionally, the algorithm it must have.
 * @param params.privateKey - The private key as a JWK object, a JWK JSON string or a PKCS#8 PEM.
 * @param params.alg - The expected algorithm. Fails when the key has another one.
 * @returns The signing key with its public JWK and `kid` (RFC 7638 thumbprint).
 * @throws {TypeError} If the input is not a private key, has an unsupported type or curve, does not match `alg` or
 * the JWK `alg` member, is an RSA key shorter than 2048 bits, or is a PEM other than PKCS#8.
 */
export async function importSiwxJwtKey(params: {
  privateKey: string | JsonWebKey;
  alg?: SiwxJwtAlgorithm;
}): Promise<SiwxJwtKey> {
  const { privateKey, alg } = params;
  if (typeof privateKey !== 'string') return importPrivateJwk(privateKey, alg);

  const text = privateKey.trim();
  if (text.startsWith('{')) {
    let jwk: JsonWebKey;
    try {
      jwk = JSON.parse(text) as JsonWebKey;
    } catch {
      throw new TypeError('[SIWX-SERVER] The JWT private key is not valid JSON.');
    }
    return importPrivateJwk(jwk, alg);
  }
  if (text.includes('-----BEGIN')) return importPkcs8Pem(text, alg);
  throw new TypeError('[SIWX-SERVER] The JWT private key must be a JWK (object or JSON) or a PKCS#8 PEM.');
}

/**
 * Builds the JWKS to publish: the public JWK of every key, in order, without duplicate `kid`s. Pass the current
 * signing key first and the keys it replaced after it, so tokens signed before a rotation keep verifying until they
 * expire.
 *
 * @param keys - Signing keys (their public JWK is used) and/or public JWKs.
 * @returns The JWKS, safe to serve publicly.
 */
export function createSiwxJwks(keys: ReadonlyArray<SiwxJwtKey | SiwxPublicJwk>): SiwxJwks {
  const seen = new Set<string>();
  const result: SiwxPublicJwk[] = [];
  for (const key of keys) {
    const jwk = 'privateKey' in key ? key.publicJwk : toSiwxPublicJwk(key, key.alg, key.kid);
    if (seen.has(jwk.kid)) continue;
    seen.add(jwk.kid);
    result.push(jwk);
  }
  return { keys: result };
}

/** Removes `use`, `key_ops` and `ext` from a JWK. */
function withoutUsageMembers(jwk: JsonWebKey): JsonWebKey {
  const copy: JsonWebKey & Record<string, unknown> = { ...jwk };
  for (const member of USAGE_MEMBERS) delete copy[member];
  return copy;
}

/** Imports a private JWK after checking its type, `alg` and size. */
async function importPrivateJwk(jwk: JsonWebKey, expected?: SiwxJwtAlgorithm): Promise<SiwxJwtKey> {
  if (!jwk || typeof jwk !== 'object' || !jwk.kty) {
    throw new TypeError('[SIWX-SERVER] The JWT private key is not a JWK.');
  }
  if (!jwk.d) {
    throw new TypeError('[SIWX-SERVER] The JWT key is a public key; a private key is needed to sign.');
  }
  const alg = siwxJwtAlgorithmOf(jwk);
  if (jwk.alg && jwk.alg !== alg) {
    throw new TypeError(`[SIWX-SERVER] The JWK alg ${jwk.alg} does not match its key type (${alg}).`);
  }
  if (expected && expected !== alg) {
    throw new TypeError(`[SIWX-SERVER] Expected a ${expected} key, got a ${alg} key.`);
  }
  if (alg === 'RS256' && base64UrlToBytes(jwk.n ?? '').length * 8 < MIN_RSA_BITS) {
    throw new TypeError(`[SIWX-SERVER] RSA keys must have at least ${MIN_RSA_BITS} bits.`);
  }

  let privateKey: CryptoKey;
  try {
    privateKey = await globalThis.crypto.subtle.importKey(
      'jwk',
      withoutUsageMembers({ ...jwk, alg }),
      SIWX_JWT_ALGORITHMS[alg].importParams,
      false,
      ['sign'],
    );
  } catch (error) {
    throw new TypeError(`[SIWX-SERVER] The JWT private key could not be imported: ${String(error)}`, { cause: error });
  }
  const kid = await siwxJwkThumbprint(jwk);
  return { alg, kid, privateKey, publicJwk: toSiwxPublicJwk(jwk, alg, kid) };
}

/** Imports a PKCS#8 PEM by converting it to a JWK first. */
async function importPkcs8Pem(pem: string, expected?: SiwxJwtAlgorithm): Promise<SiwxJwtKey> {
  const normalized = pem.replace(/\\n/g, '\n').replace(/\r\n/g, '\n');
  const match = /-----BEGIN PRIVATE KEY-----([\s\S]+?)-----END PRIVATE KEY-----/.exec(normalized);
  if (!match) {
    throw new TypeError(
      '[SIWX-SERVER] Only PKCS#8 PEM keys (-----BEGIN PRIVATE KEY-----) are supported. Convert SEC1 or PKCS#1 keys with `openssl pkcs8 -topk8 -nocrypt`.',
    );
  }
  const der = base64UrlToBytes(match[1].replace(/\s+/g, '').replace(/\+/g, '-').replace(/\//g, '_'));

  for (const alg of expected ? [expected] : (['ES256', 'RS256'] as const)) {
    let jwk: JsonWebKey;
    try {
      const extractable = await globalThis.crypto.subtle.importKey(
        'pkcs8',
        der,
        SIWX_JWT_ALGORITHMS[alg].importParams,
        true,
        ['sign'],
      );
      jwk = await globalThis.crypto.subtle.exportKey('jwk', extractable);
    } catch {
      continue;
    }
    return importPrivateJwk(jwk, alg);
  }
  throw new TypeError(`[SIWX-SERVER] The PEM is not ${expected ? `a ${expected}` : 'an EC P-256 or RSA'} private key.`);
}
