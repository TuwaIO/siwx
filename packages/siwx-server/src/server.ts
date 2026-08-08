/**
 * @fileoverview Server-side CAIP-122 payload verification and session utilities.
 * Backend-agnostic — compatible with any Node.js or Edge runtime (Next.js, NestJS, Hono, etc.).
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
  SerializedCookieSession,
  ServerVerifyOptions,
  ServerVerifyResult,
  SiwxSession,
} from './types';
import { toSession } from './types';

/**
 * Parses and validates a raw CAIP-122 payload (message + signature) on the server side.
 * Dynamically routes verification to the correct chain adapter based on the CAIP-2 namespace.
 *
 * This function is the primary entry point for server-side authentication.
 * It handles EVM (eip155) and Solana chains.
 *
 * @param payload - The `{ message, signature }` payload sent by the client.
 * @param options - Optional server-side verification options (nonce replay protection, etc.).
 * @returns A `ServerVerifyResult` with `success: true` and the parsed session data, or an error.
 *
 * @example
 * ```ts
 * // In a Next.js API route or NestJS controller:
 * const result = await verifySiwxPayload({ message, signature }, {
 *   usedNonces: await redis.smembers('used_nonces'),
 * });
 * if (result.success) {
 *   // Session is valid — issue a cookie or JWT
 * }
 * ```
 */
export async function verifySiwxPayload(
  payload: SiwxVerifyPayload,
  options: ServerVerifyOptions = {},
): Promise<ServerVerifyResult> {
  try {
    const parsed = parseMessage(payload.message);

    const validation = validateMessage(parsed, { skipExpiration: options.skipExpiration });
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

    // Dynamically import the appropriate chain adapter to keep this package dependency-free
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

    // This branch is unreachable due to the namespace check above, but satisfies TypeScript.
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
 * Encodes a string to base64url format without Node.js Buffer dependency.
 * Compatible with Node.js 20+ and Edge runtimes (Cloudflare Workers, Vercel Edge).
 * @internal
 */
function encodeBase64Url(value: string): string {
  return btoa(value).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

/**
 * Decodes a base64url-encoded string back to plain text.
 * @internal
 */
function decodeBase64Url(value: string): string {
  const base64 = value.replace(/-/g, '+').replace(/_/g, '/');
  return atob(base64);
}

/**
 * Serializes a `SiwxSession` into an `HttpOnly` cookie string.
 * The session data is base64url-encoded (not encrypted — use a signed cookie or JWT for production).
 *
 * This utility is intentionally simple. For production use, wrap the session
 * in a signed/encrypted format using a library like `iron-session` or `jose`.
 *
 * @param session - The verified session data to serialize.
 * @param opts - Cookie options (name, maxAge, secure, SameSite, etc.).
 * @returns A `SerializedCookieSession` containing the `Set-Cookie` header value and session data.
 *
 * @example
 * ```ts
 * const { cookieHeader } = serializeCookieSession(session);
 * return new Response(null, { headers: { 'Set-Cookie': cookieHeader } });
 * ```
 */
export function serializeCookieSession(session: SiwxSession, opts: CookieOptions = {}): SerializedCookieSession {
  const {
    name = 'siwx-session',
    maxAge = 60 * 60 * 24 * 7, // 7 days
    path = '/',
    domain,
    secure = true,
    sameSite = 'Strict',
  } = opts;

  const cookieValue = encodeBase64Url(JSON.stringify(session));

  const parts = [`${name}=${cookieValue}`, `Max-Age=${maxAge}`, `Path=${path}`, `HttpOnly`, `SameSite=${sameSite}`];

  if (secure) parts.push('Secure');
  if (domain) parts.push(`Domain=${domain}`);

  return {
    cookieHeader: parts.join('; '),
    session,
    cookieValue,
  };
}

/**
 * Deserializes a `SiwxSession` from a base64url-encoded cookie value.
 * This is the inverse of `serializeCookieSession`.
 *
 * @param cookieValue - The raw cookie value string (not the full header).
 * @returns The deserialized `SiwxSession`, or `null` if the value is invalid or malformed.
 *
 * @example
 * ```ts
 * const session = deserializeCookieSession(request.cookies.get('siwx-session'));
 * if (session) console.log('Session address:', session.address);
 * ```
 */
export function deserializeCookieSession(cookieValue: string): SiwxSession | null {
  try {
    const json = decodeBase64Url(cookieValue);
    return JSON.parse(json) as SiwxSession;
  } catch {
    return null;
  }
}

/**
 * Re-exports `generateNonce` from `@tuwaio/siwx-core` for convenience.
 * Use this on the server to generate a nonce before sending it to the client.
 *
 * @returns A 32-character cryptographically secure hex nonce string.
 *
 * @example
 * ```ts
 * const nonce = generateServerNonce();
 * // Store in Redis or session, then send to client
 * await redis.set(`nonce:${nonce}`, '1', 'EX', 300);
 * ```
 */
export { generateNonce as generateServerNonce };

/**
 * Converts a `ParsedSiwxMessage` to a lean `SiwxSession` object.
 * Useful for custom verification flows where you call chain adapters directly.
 *
 * @param parsed - The parsed and verified CAIP-122 message.
 * @returns A `SiwxSession` ready to be serialized.
 */
export { toSession };
