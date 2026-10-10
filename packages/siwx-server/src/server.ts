/**
 * @file Server-side CAIP-122 payload verification and session utilities.
 * Backend-agnostic — compatible with Node.js 20+ and Edge runtimes (Cloudflare Workers, Next.js, Fastify).
 */

import { parseCaip2ChainId } from '@tuwaio/orbit-core';
import type { SiwxVerifyPayload } from '@tuwaio/siwx-core';
import {
  generateNonce,
  isChainIdAllowed,
  parseMessage,
  SiwxNonceReplayError,
  SiwxUnsupportedNamespaceError,
  validateMessage,
} from '@tuwaio/siwx-core';

import { base64UrlToBytes, base64UrlToUtf8, bytesToBase64Url, utf8ToBase64Url } from './encoding';
import type {
  CookieOptions,
  GetSiwxServerSessionOptions,
  ServerVerifyOptions,
  ServerVerifyResult,
  SiwxNonceStore,
  SiwxSession,
  SiwxSessionRecord,
  SiwxSessionStore,
  StatelessDemoTokenPayload,
} from './types';
import { toSession } from './types';

/**
 * Verifies a signed CAIP-122 message on the server, for any supported chain.
 *
 * Steps: parse the message, run {@link validateMessage} with `options.policy` (format, expiration with
 * `clockSkewSeconds`, `notBefore` and the policy rules), reject nonces listed in `options.usedNonces`, then route by the `chainId` namespace to `verifyEvmSignature`
 * (`@tuwaio/siwx-evm`, with the smart contract wallet fallback, EIP-1271 and ERC-6492, when `options.publicClient`
 * gives a client for the chain of the message) or `verifyEd25519`
 * (`@tuwaio/siwx-solana`).
 *
 * Side effects: dynamically imports the chain package of the namespace, so `@tuwaio/siwx-evm` and/or
 * `@tuwaio/siwx-solana` must be installed for the chains you accept; the smart contract wallet fallback makes one RPC call.
 * It does not consume nonces or create sessions: pair it with a {@link SiwxNonceStore} and a
 * {@link SiwxSessionStore}, or use the handlers of `@tuwaio/siwx-server/next`.
 *
 * @param payload - The `{ message, signature }` sent by the client.
 * @param options - Policy, replay protection and chain options.
 * @returns `{ success: true, data, namespace }` with the parsed message, or `{ success: false, error }`. Never
 * throws: every failure is returned as `error`.
 */
export async function verifySiwxPayload(
  payload: SiwxVerifyPayload,
  options: ServerVerifyOptions = {},
): Promise<ServerVerifyResult> {
  try {
    const parsed = parseMessage(payload.message);

    const validation = validateMessage(parsed, {
      skipExpiration: options.skipExpiration,
      policy: options.policy,
    });
    if (!validation.valid) {
      return { success: false, error: `Validation failed: ${validation.errors.join(', ')}` };
    }

    // Check nonce replay
    if (options.usedNonces?.has(parsed.nonce)) {
      throw new SiwxNonceReplayError(parsed.nonce);
    }

    const namespace = parseCaip2ChainId(parsed.chainId)?.namespace;

    if (!namespace || !['eip155', 'solana'].includes(namespace)) {
      throw new SiwxUnsupportedNamespaceError(namespace ?? 'unknown');
    }

    // Dynamically import the appropriate chain adapter
    if (namespace === 'eip155') {
      const { verifyEvmSignature } = await import('@tuwaio/siwx-evm');
      const result = await verifyEvmSignature(payload.message, payload.signature as `0x${string}`, {
        skipExpiration: options.skipExpiration,
        publicClient: options.publicClient,
      });
      return { ...result, namespace };
    }

    if (namespace === 'solana') {
      const { verifyEd25519 } = await import('@tuwaio/siwx-solana');
      const result = await verifyEd25519(payload, { skipExpiration: options.skipExpiration });
      return result.success ? { ...result, namespace, method: 'ed25519' } : { ...result, namespace };
    }

    return { success: false, error: 'Unsupported namespace.' };
  } catch (error) {
    if (error instanceof SiwxNonceReplayError || error instanceof SiwxUnsupportedNamespaceError) {
      return { success: false, error: error.message };
    }
    return { success: false, error: `Server verification failed: ${String(error)}` };
  }
}

/**
 * Imports an HMAC-SHA256 CryptoKey using Web Crypto API.
 * @internal
 */
async function getCryptoKey(secret: string): Promise<CryptoKey> {
  const encoder = new TextEncoder();
  return globalThis.crypto.subtle.importKey('raw', encoder.encode(secret), { name: 'HMAC', hash: 'SHA-256' }, false, [
    'sign',
    'verify',
  ]);
}

/**
 * Creates a stateless demo session token: the session as base64url JSON ({@link StatelessDemoTokenPayload}) plus
 * an HMAC-SHA256 signature (Web Crypto). The token is signed, not encrypted, and cannot be revoked before it
 * expires.
 *
 * @param session - The verified session to sign.
 * @param secret - Server-only signing secret of at least 32 characters.
 * @param ttlSeconds - Token lifetime in seconds, used only when the session has no `expirationTime`; otherwise the
 * token expires with the message.
 * @returns The token, formatted as `{payload}.{signature}`.
 * @throws {Error} If `secret` is shorter than 32 characters.
 */
export async function signStatelessDemoSession(
  session: SiwxSession,
  secret: string,
  ttlSeconds: number = 1800,
): Promise<string> {
  if (!secret || secret.length < 32) {
    throw new Error('[SIWX-SERVER] Stateless demo signing secret must be at least 32 characters long.');
  }

  const now = Date.now();
  const expiresAt = now + ttlSeconds * 1000;
  const payload: StatelessDemoTokenPayload = {
    version: 1,
    address: session.address,
    chainId: session.chainId,
    domain: session.domain,
    nonce: session.nonce,
    issuedAt: session.issuedAt,
    expirationTime: session.expirationTime ?? new Date(expiresAt).toISOString(),
    sessionId: generateNonce(),
    mode: 'demo',
  };

  const payloadJson = JSON.stringify(payload);
  const payloadBase64 = utf8ToBase64Url(payloadJson);
  const key = await getCryptoKey(secret);
  const encoder = new TextEncoder();
  const signature = await globalThis.crypto.subtle.sign('HMAC', key, encoder.encode(payloadBase64));
  const signatureBase64 = bytesToBase64Url(new Uint8Array(signature));

  return `${payloadBase64}.${signatureBase64}`;
}

/**
 * Verifies a token created by {@link signStatelessDemoSession}: checks the HMAC signature with Web Crypto, the
 * token version and mode, and its expiry (with `policy.clockSkewSeconds`, 60 seconds by default).
 *
 * Only `expectedDomain` and `allowedChainIds` (exact match, except that a Solana cluster matches under its name and its
 * genesis-hash chain ID) of the policy are applied; other policy fields are ignored because they were checked when the
 * token was issued.
 *
 * @param token - The token from the session cookie.
 * @param secret - The secret the token was signed with.
 * @param policy - Optional policy to check against the token.
 * @returns The session, or `null` if the token is missing, malformed, tampered, expired or rejected by the policy.
 * Never throws.
 */
export async function verifyStatelessDemoSession(
  token: string | null | undefined,
  secret: string,
  policy?: import('@tuwaio/siwx-core').SiwxVerificationPolicy,
): Promise<SiwxSession | null> {
  if (!token || typeof token !== 'string' || !secret) return null;
  const parts = token.split('.');
  if (parts.length !== 2) return null;
  const [payloadBase64, signatureBase64] = parts;

  try {
    const key = await getCryptoKey(secret);
    const signatureBytes = base64UrlToBytes(signatureBase64);
    const encoder = new TextEncoder();

    const isValid = await globalThis.crypto.subtle.verify(
      'HMAC',
      key,
      signatureBytes as unknown as BufferSource,
      encoder.encode(payloadBase64),
    );
    if (!isValid) return null;

    const json = base64UrlToUtf8(payloadBase64);
    const payload = JSON.parse(json) as StatelessDemoTokenPayload;

    if (payload.version !== 1 || payload.mode !== 'demo') return null;

    // Check expiration
    if (payload.expirationTime) {
      const expiresAt = new Date(payload.expirationTime).getTime();
      const clockSkew = (policy?.clockSkewSeconds ?? 60) * 1000;
      if (isNaN(expiresAt) || expiresAt + clockSkew < Date.now()) {
        return null;
      }
    }

    // Check domain policy
    if (policy?.expectedDomain !== undefined) {
      const expected = Array.isArray(policy.expectedDomain) ? policy.expectedDomain : [policy.expectedDomain];
      if (!expected.some((d) => d.toLowerCase() === payload.domain.toLowerCase())) {
        return null;
      }
    }

    // Check allowed chains
    if (!isChainIdAllowed(payload.chainId, policy?.allowedChainIds)) {
      return null;
    }

    return {
      address: payload.address,
      chainId: payload.chainId,
      domain: payload.domain,
      nonce: payload.nonce,
      issuedAt: payload.issuedAt,
      expirationTime: payload.expirationTime,
    };
  } catch {
    return null;
  }
}

/** Domain separation prefix of demo nonce MACs, so they can never be confused with demo session token MACs. */
const DEMO_NONCE_MAC_PREFIX = 'siwx-demo-nonce:';

/** Hex length of the random part of a demo nonce (16 bytes from {@link generateNonce}). */
const DEMO_NONCE_RANDOM_LENGTH = 32;

/** Hex length of the expiry part of a demo nonce (Unix time in seconds). */
const DEMO_NONCE_EXPIRY_LENGTH = 10;

/** Format of a demo nonce: random part, expiry and HMAC-SHA256, all lowercase hex. */
const DEMO_NONCE_PATTERN = /^[0-9a-f]{106}$/;

/**
 * Encodes bytes as lowercase hex.
 * @internal
 */
function bytesToHex(bytes: Uint8Array): string {
  return Array.from(bytes, (byte) => byte.toString(16).padStart(2, '0')).join('');
}

/**
 * Decodes a lowercase hex string into bytes.
 * @internal
 */
function hexToBytes(hex: string): Uint8Array<ArrayBuffer> {
  const bytes = new Uint8Array(new ArrayBuffer(hex.length / 2));
  for (let i = 0; i < bytes.length; i++) {
    bytes[i] = parseInt(hex.slice(i * 2, i * 2 + 2), 16);
  }
  return bytes;
}

/**
 * Issues a challenge nonce for the stateless demo profile: a random value and an expiry time, signed with
 * HMAC-SHA256 (Web Crypto), encoded as 106 lowercase hex characters so that it is a valid CAIP-122 nonce.
 * {@link verifyStatelessDemoNonce} can then check, without any storage, that the server issued the nonce and that it
 * has not expired.
 *
 * @param secret - Server-only signing secret of at least 32 characters.
 * @param ttlSeconds - How long the nonce can be used, in seconds.
 * @returns The signed nonce.
 * @throws {Error} If `secret` is shorter than 32 characters.
 */
export async function issueStatelessDemoNonce(secret: string, ttlSeconds: number = 300): Promise<string> {
  if (!secret || secret.length < 32) {
    throw new Error('[SIWX-SERVER] Stateless demo signing secret must be at least 32 characters long.');
  }

  const expiresAtSeconds = Math.floor(Date.now() / 1000) + ttlSeconds;
  const body = generateNonce() + expiresAtSeconds.toString(16).padStart(DEMO_NONCE_EXPIRY_LENGTH, '0');
  const key = await getCryptoKey(secret);
  const mac = await globalThis.crypto.subtle.sign('HMAC', key, new TextEncoder().encode(DEMO_NONCE_MAC_PREFIX + body));

  return body + bytesToHex(new Uint8Array(mac));
}

/**
 * Checks a nonce issued by {@link issueStatelessDemoNonce}: its format, its HMAC signature (constant-time, Web
 * Crypto) and its expiry. It does not track usage, so the same nonce passes until it expires; callers that need
 * single use must remember consumed nonces (`createStatelessDemoSiwxHandler` does so per server instance).
 *
 * @param nonce - The nonce of the signed message.
 * @param secret - The secret the nonce was issued with.
 * @returns `true` if the nonce was issued with `secret` and has not expired; otherwise `false`. Never throws.
 */
export async function verifyStatelessDemoNonce(nonce: string, secret: string): Promise<boolean> {
  if (typeof nonce !== 'string' || !secret || !DEMO_NONCE_PATTERN.test(nonce)) return false;

  const bodyLength = DEMO_NONCE_RANDOM_LENGTH + DEMO_NONCE_EXPIRY_LENGTH;
  const body = nonce.slice(0, bodyLength);
  const mac = nonce.slice(bodyLength);

  try {
    const key = await getCryptoKey(secret);
    const isValid = await globalThis.crypto.subtle.verify(
      'HMAC',
      key,
      hexToBytes(mac),
      new TextEncoder().encode(DEMO_NONCE_MAC_PREFIX + body),
    );
    if (!isValid) return false;

    const expiresAtSeconds = parseInt(body.slice(DEMO_NONCE_RANDOM_LENGTH), 16);
    return expiresAtSeconds * 1000 >= Date.now();
  } catch {
    return false;
  }
}

/**
 * Formats a `Set-Cookie` header value for the session cookie: `HttpOnly`, `Secure` and `SameSite=Strict` by
 * default.
 *
 * @param value - The cookie value (session ID or demo token). Written as-is, without encoding.
 * @param opts - Cookie attributes. Defaults: name `siwx-session-v2`, `Max-Age` 604800, path `/`.
 * @returns The header value, e.g. `siwx-session-v2=…; Max-Age=604800; Path=/; HttpOnly; SameSite=Strict; Secure`.
 */
export function createSessionCookie(value: string, opts: CookieOptions = {}): string {
  const {
    name = 'siwx-session-v2',
    maxAge = 60 * 60 * 24 * 7,
    path = '/',
    domain,
    secure = true,
    sameSite = 'Strict',
  } = opts;

  const parts = [`${name}=${value}`, `Max-Age=${maxAge}`, `Path=${path}`, `HttpOnly`, `SameSite=${sameSite}`];

  if (secure) parts.push('Secure');
  if (domain) parts.push(`Domain=${domain}`);

  return parts.join('; ');
}

/**
 * Formats a `Set-Cookie` header value that deletes the session cookie (`Max-Age=0` and an expiry date in the
 * past). Use the same `name`, `path` and `domain` as when the cookie was set.
 *
 * @param opts - Cookie attributes. `maxAge` is ignored.
 * @returns The header value.
 */
export function createClearCookie(opts: CookieOptions = {}): string {
  const { name = 'siwx-session-v2', path = '/', domain, secure = true, sameSite = 'Strict' } = opts;
  const parts = [
    `${name}=`,
    `Path=${path}`,
    `Expires=Thu, 01 Jan 1970 00:00:00 GMT`,
    `Max-Age=0`,
    `HttpOnly`,
    `SameSite=${sameSite}`,
  ];
  if (secure) parts.push('Secure');
  if (domain) parts.push(`Domain=${domain}`);
  return parts.join('; ');
}

/**
 * Reads one cookie from a `Cookie` request header. Pairs must be separated by `"; "`; values are returned as-is,
 * without URL-decoding.
 *
 * @param cookieHeader - The `Cookie` header value.
 * @param name - The cookie name.
 * @returns The cookie value, or `null` when the header is empty or has no such cookie.
 */
export function parseCookie(cookieHeader: string | null | undefined, name: string): string | null {
  if (!cookieHeader) return null;
  const cookies = Object.fromEntries(
    cookieHeader
      .split('; ')
      .filter(Boolean)
      .map((c) => {
        const parts = c.split('=');
        return [parts[0].trim(), parts.slice(1).join('=')];
      }),
  );
  return cookies[name] ?? null;
}

/**
 * In-memory {@link SiwxSessionStore} for local development and tests. Sessions live in a `Map` of the current
 * process: they are lost on restart and not shared between instances or serverless invocations. Session IDs are
 * 32-character hex strings from {@link generateNonce}.
 */
export class MemorySiwxSessionStore implements SiwxSessionStore {
  private records = new Map<string, SiwxSessionRecord>();

  /**
   * @param options - Store options.
   * @param options.allowInProduction - Allows the store when `NODE_ENV` is `production`.
   * @throws {Error} When `process.env.NODE_ENV` is `production` and `allowInProduction` is not `true`.
   */
  constructor(options?: { allowInProduction?: boolean }) {
    const isProduction =
      typeof globalThis !== 'undefined' &&
      (globalThis as unknown as { process?: { env?: { NODE_ENV?: string } } }).process?.env?.NODE_ENV === 'production';
    if (isProduction && !options?.allowInProduction) {
      throw new Error(
        '[SIWX-SERVER] MemorySiwxSessionStore must not be used in production. Connect Redis or a durable store.',
      );
    }
  }

  async create(input: { session: SiwxSession; ttlSeconds: number }): Promise<SiwxSessionRecord> {
    const id = generateNonce();
    const createdAt = Date.now();
    const expiresAt = createdAt + input.ttlSeconds * 1000;
    const record: SiwxSessionRecord = {
      id,
      session: input.session,
      createdAt,
      expiresAt,
    };
    this.records.set(id, record);
    return record;
  }

  async get(id: string): Promise<SiwxSessionRecord | null> {
    const record = this.records.get(id);
    if (!record) return null;
    if (record.expiresAt < Date.now()) {
      this.records.delete(id);
      return null;
    }
    return record;
  }

  async bindSubject(id: string, subjectId: string): Promise<boolean> {
    const record = await this.get(id);
    if (!record) return false;
    record.subjectId = subjectId;
    return true;
  }

  async revoke(id: string): Promise<void> {
    this.records.delete(id);
  }
}

/**
 * In-memory {@link SiwxNonceStore} for local development and tests. Nonces live in a `Map` of the current process:
 * they are lost on restart and not shared between instances or serverless invocations, so a nonce issued by one
 * instance is rejected by another.
 */
export class MemorySiwxNonceStore implements SiwxNonceStore {
  private nonces = new Map<string, number>();

  /**
   * @param options - Store options.
   * @param options.allowInProduction - Allows the store when `NODE_ENV` is `production`.
   * @throws {Error} When `process.env.NODE_ENV` is `production` and `allowInProduction` is not `true`.
   */
  constructor(options?: { allowInProduction?: boolean }) {
    const isProduction =
      typeof globalThis !== 'undefined' &&
      (globalThis as unknown as { process?: { env?: { NODE_ENV?: string } } }).process?.env?.NODE_ENV === 'production';
    if (isProduction && !options?.allowInProduction) {
      throw new Error(
        '[SIWX-SERVER] MemorySiwxNonceStore must not be used in production. Connect Redis or a durable store.',
      );
    }
  }

  async issue(input: { nonce: string; ttlSeconds: number }): Promise<void> {
    const expiresAt = Date.now() + input.ttlSeconds * 1000;
    this.nonces.set(input.nonce, expiresAt);
  }

  async consume(input: { nonce: string }): Promise<boolean> {
    const expiresAt = this.nonces.get(input.nonce);
    if (!expiresAt) return false;
    this.nonces.delete(input.nonce);
    if (expiresAt < Date.now()) return false;
    return true;
  }
}

/**
 * Reads the SIWX session of the current request from its session cookie. Use it in Server Actions, Route Handlers
 * or any server code instead of trusting session data sent by the client.
 *
 * With `sessionStore`, the cookie value is a session ID looked up with `sessionStore.get` (which enforces
 * expiry). Otherwise, with `signingSecret`, it is a demo token verified with {@link verifyStatelessDemoSession}.
 * See {@link GetSiwxServerSessionOptions} for the accepted cookie sources and the policy checks.
 *
 * @param options - Cookie source, store or secret, and optional policy.
 * @returns The session, or `null` when there is no cookie, no store or secret, or the session is unknown, expired or
 * rejected by the policy.
 * @throws Errors thrown by `sessionStore.get` are not caught.
 *
 * @example
 * ```ts
 * // In Next.js Server Actions:
 * import { cookies } from 'next/headers';
 * import { getSiwxServerSession } from '@tuwaio/siwx-server';
 * import { sessionStore } from '@/lib/authStores';
 *
 * const session = await getSiwxServerSession({
 *   cookieSource: await cookies(),
 *   sessionStore,
 * });
 * ```
 */
export async function getSiwxServerSession(options: GetSiwxServerSessionOptions): Promise<SiwxSession | null> {
  const { cookieSource, cookieName = 'siwx-session-v2', sessionStore, signingSecret, policy } = options;

  if (!cookieSource) return null;

  let cookieValue: string | null = null;

  if (typeof cookieSource === 'string') {
    cookieValue = cookieSource.includes('=') ? parseCookie(cookieSource, cookieName) : cookieSource;
  } else if (
    typeof (cookieSource as Request).headers === 'object' &&
    typeof (cookieSource as Request).headers?.get === 'function'
  ) {
    const header = (cookieSource as Request).headers.get('cookie');
    cookieValue = parseCookie(header, cookieName);
  } else if (typeof (cookieSource as { get: (name: string) => unknown }).get === 'function') {
    const raw = (cookieSource as { get: (name: string) => { value: string } | string | undefined | null }).get(
      cookieName,
    );
    if (raw && typeof raw === 'object' && 'value' in raw) {
      cookieValue = raw.value;
    } else if (typeof raw === 'string') {
      cookieValue = raw.includes('=') ? parseCookie(raw, cookieName) : raw;
    } else if (typeof (cookieSource as Headers).get === 'function') {
      const header = (cookieSource as Headers).get('cookie');
      if (header) {
        cookieValue = parseCookie(header, cookieName);
      }
    }
  }

  if (!cookieValue) return null;

  // 1. Durable session lookup
  if (sessionStore) {
    const record = await sessionStore.get(cookieValue);
    if (!record?.session) return null;

    if (policy) {
      if (policy.expectedDomain !== undefined) {
        const expected = Array.isArray(policy.expectedDomain) ? policy.expectedDomain : [policy.expectedDomain];
        if (!expected.some((d) => d.toLowerCase() === record.session.domain.toLowerCase())) {
          return null;
        }
      }
      if (!isChainIdAllowed(record.session.chainId, policy.allowedChainIds)) {
        return null;
      }
      if (policy.requireExpirationTime && !record.session.expirationTime) {
        return null;
      }
    }

    return record.session;
  }

  // 2. Stateless demo HMAC token verification
  if (signingSecret) {
    return verifyStatelessDemoSession(cookieValue, signingSecret, policy);
  }

  return null;
}

/**
 * Alias of `generateNonce` from `@tuwaio/siwx-core`, for issuing challenge nonces and session IDs on the server.
 */
export { generateNonce as generateServerNonce };

export { toSession };
