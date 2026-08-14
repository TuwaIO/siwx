/**
 * @fileoverview Server-side types for the @tuwaio/siwx-server package.
 */

import type { ParsedSiwxMessage, SiwxVerificationPolicy, SiwxVerifyResult } from '@tuwaio/siwx-core';

/**
 * Options for the `verifySiwxPayload` function.
 */
export interface ServerVerifyOptions {
  /**
   * A set of nonces that have already been used.
   * If the payload's nonce is found in this set, verification will fail
   * to prevent replay attacks.
   */
  usedNonces?: Set<string>;

  /**
   * If true, skips the `expirationTime` validation check.
   * Not recommended for production use.
   * @default false
   */
  skipExpiration?: boolean;

  /**
   * Optional verification policy to enforce on the message fields.
   */
  policy?: SiwxVerificationPolicy;

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
 * Represents a stored session record in a durable session store.
 */
export interface SiwxSessionRecord {
  /** Unique opaque session identifier (e.g. secure random UUID). */
  id: string;
  /** The verified SIWX session data. */
  session: SiwxSession;
  /** Optional subject ID (e.g., Payload User ID or internal database ID) bound to this session. */
  subjectId?: string;
  /** Timestamp in milliseconds when the session record was created. */
  createdAt: number;
  /** Timestamp in milliseconds when the session record expires. */
  expiresAt: number;
}

/**
 * Durable session store interface for production environments.
 */
export interface SiwxSessionStore {
  /**
   * Creates and stores a new session record.
   * @param input.session - The verified session data.
   * @param input.ttlSeconds - Time-to-live in seconds.
   * @returns The created session record with unique ID.
   */
  create(input: { session: SiwxSession; ttlSeconds: number }): Promise<SiwxSessionRecord>;

  /**
   * Retrieves a session record by its opaque ID.
   * @param id - The session ID.
   * @returns The session record, or null if not found or expired.
   */
  get(id: string): Promise<SiwxSessionRecord | null>;

  /**
   * Atomically binds a user/subject identifier to the session.
   * @param id - The session ID.
   * @param subjectId - The user or subject ID.
   * @returns True if binding succeeded, false if session not found.
   */
  bindSubject(id: string, subjectId: string): Promise<boolean>;

  /**
   * Revokes and removes a session record.
   * @param id - The session ID.
   */
  revoke(id: string): Promise<void>;
}

/**
 * Durable nonce store interface for single-use nonce issuance and atomic consumption.
 */
export interface SiwxNonceStore {
  /**
   * Issues and stores a new challenge nonce with TTL.
   * @param input.nonce - The unique nonce string.
   * @param input.ttlSeconds - Time-to-live in seconds (typically 300s).
   */
  issue(input: { nonce: string; ttlSeconds: number }): Promise<void>;

  /**
   * Atomically consumes a nonce, guaranteeing single-use.
   * @param input.nonce - The nonce string to consume.
   * @returns True if the nonce was valid and consumed, false if already consumed or expired.
   */
  consume(input: { nonce: string }): Promise<boolean>;
}

/**
 * Compact payload structure for stateless demo session tokens.
 */
export interface StatelessDemoTokenPayload {
  version: 1;
  address: string;
  chainId: string;
  domain: string;
  nonce: string;
  issuedAt: string;
  expirationTime?: string;
  sessionId: string;
  mode: 'demo';
}

/**
 * Limits for stateless demo profile.
 */
export interface StatelessDemoLimits {
  /** Maximum transaction payload size in bytes. */
  maxTransactionPayloadBytes?: number;
  /** Advisory request cap per session. */
  maxRequestsPerSession?: number;
}

/**
 * Options for cookie session serialization.
 */
export interface CookieOptions {
  /**
   * The name of the cookie.
   * @default "siwx-session-v2"
   */
  name?: string;
  /**
   * Max age in seconds. Defaults to 7 days for durable, 30 minutes for demo.
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
 * Options for the `getSiwxServerSession` helper function.
 */
export interface GetSiwxServerSessionOptions {
  /**
   * Cookie source:
   * - A raw Cookie string (e.g. `req.headers.get('cookie')` or `"siwx-session-v2=xyz"`)
   * - A Next.js ReadonlyRequestCookies object (from `await cookies()`)
   * - A Web API `Request` or `Headers` object
   * - Any object with a `get(name)` method
   */
  cookieSource:
    | string
    | Request
    | Headers
    | { get(name: string): { value: string } | string | undefined | null }
    | null
    | undefined;

  /**
   * The name of the cookie.
   * @default "siwx-session-v2"
   */
  cookieName?: string;

  /**
   * Durable session store (for production durable sessions).
   */
  sessionStore?: SiwxSessionStore;

  /**
   * Server HMAC secret key (for stateless demo sessions).
   */
  signingSecret?: string;

  /**
   * Optional verification policy to validate the session.
   */
  policy?: SiwxVerificationPolicy;
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
