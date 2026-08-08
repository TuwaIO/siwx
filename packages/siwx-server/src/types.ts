/**
 * @fileoverview Server-side types for the @tuwaio/siwx-server package.
 */

import type { ParsedSiwxMessage, SiwxVerifyResult } from '@tuwaio/siwx-core';

/**
 * Options for the `verifySiwxPayload` function.
 */
export interface ServerVerifyOptions {
  /**
   * A set of nonces that have already been used.
   * If the payload's nonce is found in this set, verification will fail
   * to prevent replay attacks. You should populate this from your session store or cache.
   */
  usedNonces?: Set<string>;

  /**
   * If true, skips the `expirationTime` validation check.
   * Not recommended for production use.
   * @default false
   */
  skipExpiration?: boolean;

  /**
   * Optional viem `PublicClient` instance for EVM chain EIP-1271 (smart contract wallet) verification.
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  publicClient?: any;
}

/**
 * The result of a server-side verification operation, extending the base result
 * with the verification method used.
 */
export interface ServerVerifyResult extends SiwxVerifyResult {
  /**
   * The CAIP-2 namespace used for verification routing.
   * `eip155` for EVM chains, `solana` for Solana.
   */
  namespace?: 'eip155' | 'solana';
}

/**
 * Represents a serializable session object derived from a verified CAIP-122 message.
 * This can be stored in a cookie or JWT payload.
 */
export interface SiwxSession {
  /** The verified CAIP-10 blockchain address. */
  address: string;
  /** The CAIP-2 chain ID the session is bound to. */
  chainId: string;
  /** The domain that issued the session. */
  domain: string;
  /** The nonce that was used. Must be invalidated server-side after use. */
  nonce: string;
  /** ISO 8601 timestamp when the session was issued. */
  issuedAt: string;
  /** ISO 8601 timestamp when the session expires, if set. */
  expirationTime?: string;
}

/**
 * Options for cookie session serialization.
 */
export interface CookieOptions {
  /**
   * The name of the cookie.
   * @default "siwx-session"
   */
  name?: string;
  /**
   * Max age in seconds. Defaults to 7 days.
   * @default 604800
   */
  maxAge?: number;
  /**
   * The cookie path.
   * @default "/"
   */
  path?: string;
  /**
   * The cookie domain.
   */
  domain?: string;
  /**
   * Whether to set the Secure flag.
   * @default true
   */
  secure?: boolean;
  /**
   * The SameSite policy.
   * @default "Strict"
   */
  sameSite?: 'Strict' | 'Lax' | 'None';
}

/**
 * The serialized cookie string and session data together.
 */
export interface SerializedCookieSession {
  /** The full `Set-Cookie` header value. */
  cookieHeader: string;
  /** The session data embedded in the cookie. */
  session: SiwxSession;
  /** The base64url-encoded session payload (the cookie value). */
  cookieValue: string;
}

/**
 * Converts a ParsedSiwxMessage to a lean SiwxSession object.
 * @internal
 */
export function toSession(parsed: ParsedSiwxMessage): SiwxSession {
  return {
    address: parsed.address,
    chainId: parsed.chainId,
    domain: parsed.domain,
    nonce: parsed.nonce,
    issuedAt: parsed.issuedAt,
    expirationTime: parsed.expirationTime,
  };
}
