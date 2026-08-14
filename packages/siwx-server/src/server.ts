/**
 * @fileoverview Server-side CAIP-122 payload verification and session utilities.
 * Backend-agnostic — compatible with Node.js 20+ and Edge runtimes (Cloudflare Workers, Next.js, Fastify).
 */

import type { SiwxVerifyPayload } from '@tuwaio/siwx-core';
import {
  generateNonce,
  parseMessage,
  SiwxExpiredSessionError,
  SiwxNonceReplayError,
  SiwxUnsupportedNamespaceError,
  validateMessage,
} from '@tuwaio/siwx-core';

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
 * Parses and validates a raw CAIP-122 payload (message + signature) on the server side.
 * Dynamically routes verification to the correct chain adapter based on the CAIP-2 namespace.
 *
 * @param payload - The `{ message, signature }` payload sent by the client.
 * @param options - Server-side verification options (policy, nonce replay protection, etc.).
 * @returns A `ServerVerifyResult` with `success: true` and the parsed session data, or an error.
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

    // Check expiration unless explicitly skipped
    if (!options.skipExpiration && parsed.expirationTime) {
      if (new Date(parsed.expirationTime) < new Date()) {
        throw new SiwxExpiredSessionError(parsed.expirationTime);
      }
    }

    // Check nonce replay
    if (options.usedNonces?.has(parsed.nonce)) {
      throw new SiwxNonceReplayError(parsed.nonce);
    }

    const namespace = parsed.chainId.split(':')[0] as 'eip155' | 'solana' | undefined;

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
      return { ...result, namespace };
    }

    return { success: false, error: 'Unsupported namespace.' };
  } catch (error) {
    if (
      error instanceof SiwxExpiredSessionError ||
      error instanceof SiwxNonceReplayError ||
      error instanceof SiwxUnsupportedNamespaceError
    ) {
      return { success: false, error: error.message };
    }
    return { success: false, error: `Server verification failed: ${String(error)}` };
  }
}

/**
 * Encodes string to base64url.
 * @internal
 */
function encodeBase64Url(value: string): string {
  return btoa(value).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

/**
 * Decodes base64url string.
 * @internal
 */
function decodeBase64Url(value: string): string {
  const base64 = value.replace(/-/g, '+').replace(/_/g, '/');
  return atob(base64);
}

/**
 * Converts Uint8Array to base64url.
 * @internal
 */
function bytesToBase64Url(bytes: Uint8Array): string {
  let binary = '';
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

/**
 * Converts base64url to Uint8Array.
 * @internal
 */
function base64UrlToBytes(base64url: string): Uint8Array {
  const base64 = base64url.replace(/-/g, '+').replace(/_/g, '/');
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes;
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
 * Signs a stateless demo session into an authenticated compact token.
 * Uses Web Crypto HMAC-SHA256.
 *
 * @param session - The verified session to sign.
 * @param secret - Server-only signing secret (minimum 32 bytes).
 * @param ttlSeconds - Maximum session validity in seconds (default 1800 = 30m).
 * @returns Authenticated compact token in `${payload}.${signature}` format.
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
  const payloadBase64 = encodeBase64Url(payloadJson);
  const key = await getCryptoKey(secret);
  const encoder = new TextEncoder();
  const signature = await globalThis.crypto.subtle.sign('HMAC', key, encoder.encode(payloadBase64));
  const signatureBase64 = bytesToBase64Url(new Uint8Array(signature));

  return `${payloadBase64}.${signatureBase64}`;
}

/**
 * Verifies an authenticated stateless demo session token.
 * Performs constant-time cryptographic verification and validates expiration and policy.
 *
 * @param token - Compact token from cookie (`${payload}.${signature}`).
 * @param secret - Server-only signing secret.
 * @param policy - Optional verification policy to enforce.
 * @returns The verified SiwxSession, or null if invalid, expired, or tampered.
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

    const json = decodeBase64Url(payloadBase64);
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
    if (policy?.allowedChainIds !== undefined && policy.allowedChainIds.length > 0) {
      if (!policy.allowedChainIds.includes(payload.chainId)) {
        return null;
      }
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

/**
 * Creates an HttpOnly Set-Cookie header value for a session.
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
 * Creates a clear/destroy Set-Cookie header value.
 */
export function createClearCookie(opts: CookieOptions = {}): string {
  const { name = 'siwx-session-v2', path = '/', domain } = opts;
  const parts = [
    `${name}=`,
    `Path=${path}`,
    `Expires=Thu, 01 Jan 1970 00:00:00 GMT`,
    `Max-Age=0`,
    `HttpOnly`,
    `SameSite=Strict`,
  ];
  if (domain) parts.push(`Domain=${domain}`);
  return parts.join('; ');
}

/**
 * Extracts a cookie value by name from a raw Cookie header string.
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
 * In-memory implementation of SiwxSessionStore.
 * STRICTLY for local development, prototyping, and unit testing.
 * Fails closed in production environments.
 */
export class MemorySiwxSessionStore implements SiwxSessionStore {
  private records = new Map<string, SiwxSessionRecord>();

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
 * In-memory implementation of SiwxNonceStore.
 * STRICTLY for local development, prototyping, and unit testing.
 * Fails closed in production environments.
 */
export class MemorySiwxNonceStore implements SiwxNonceStore {
  private nonces = new Map<string, number>();

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
 * Resolves and verifies an active SIWX session strictly on the server side.
 * Supports both durable session stores and stateless HMAC-signed demo cookies.
 *
 * @param options - Configuration including cookieSource, sessionStore or signingSecret, and optional policy.
 * @returns The verified `SiwxSession` object, or `null` if invalid, expired, or absent.
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
      if (policy.allowedChainIds !== undefined && policy.allowedChainIds.length > 0) {
        if (!policy.allowedChainIds.includes(record.session.chainId)) {
          return null;
        }
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
 * Re-exports `generateNonce` from `@tuwaio/siwx-core` for server challenge generation.
 */
export { generateNonce as generateServerNonce };

/**
 * Converts a `ParsedSiwxMessage` to a lean `SiwxSession` object.
 */
export { toSession };
