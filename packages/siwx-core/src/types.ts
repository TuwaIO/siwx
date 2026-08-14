/**
 * @fileoverview Core type definitions for the CAIP-122 (Sign-In With X) standard.
 * These types are chain-agnostic and form the foundation of the entire siwx ecosystem.
 *
 * @see {@link https://github.com/ChainAgnostic/CAIPs/blob/main/CAIPs/caip-122.md CAIP-122 Specification}
 */

/**
 * Supported CAIP-2 chain namespace identifiers.
 * Only EVM (eip155) and Solana are supported in v1.
 */
export type SiwxChainNamespace = 'eip155' | 'solana';

/**
 * A fully qualified CAIP-2 chain ID string.
 * @example "eip155:1" (Ethereum Mainnet)
 * @example "solana:5eykt4UsFv8P8NJdTREpY1vzqKqZKvdpK" (Solana Mainnet)
 */
export type SiwxChainId = `${SiwxChainNamespace}:${string}`;

/**
 * The lifecycle status of a SIWX authentication session.
 */
export type SiwxStatus = 'idle' | 'building' | 'signing' | 'verifying' | 'authenticated' | 'error';

/**
 * The complete set of fields required to build a CAIP-122 compliant message.
 * All fields follow the CAIP-122 specification.
 */
export interface SiwxMessageFields {
  /**
   * The RFC 3986 URI of the domain requesting the sign-in.
   * @example "app.tuwa.io"
   */
  domain: string;

  /**
   * The blockchain account address performing the sign-in, CAIP-10 compliant.
   * @example "eip155:1:0xAb5801a7D398351b8bE11C439e05C5B3259aeC9B"
   */
  address: string;

  /**
   * A statement (human-readable) that the user will sign.
   * Must not contain '\n'.
   */
  statement?: string;

  /**
   * The RFC 3986 URI referring to the resource that is the subject of the sign-in.
   * @example "https://app.tuwa.io"
   */
  uri: string;

  /**
   * The version of the CAIP-122 message specification.
   * Currently always "1".
   */
  version: '1';

  /**
   * The CAIP-2 chain ID to which the session is bound.
   * @example "eip155:1"
   */
  chainId: SiwxChainId;

  /**
   * A unique, secure, randomly generated string used to prevent replay attacks.
   * @example "32891757"
   */
  nonce: string;

  /**
   * The ISO 8601 datetime string of when the message was generated.
   * @example "2021-09-30T16:25:24Z"
   */
  issuedAt: string;

  /**
   * Optional ISO 8601 datetime string after which the session is no longer valid.
   */
  expirationTime?: string;

  /**
   * Optional ISO 8601 datetime string when the session is valid from.
   */
  notBefore?: string;

  /**
   * Optional system-specific identifier for the request.
   */
  requestId?: string;

  /**
   * Optional list of URIs the session is valid for.
   */
  resources?: string[];
}

/**
 * Policy parameters for server-side CAIP-122 message verification.
 * Enforces strict security constraints including domain, URI, chain ID, and timing windows.
 */
export interface SiwxVerificationPolicy {
  /**
   * Expected domain(s) requesting sign-in (e.g. "tuwa.io" or ["tuwa.io", "staging.tuwa.io"]).
   */
  expectedDomain?: string | string[];

  /**
   * Expected RFC 3986 URI(s) subject of sign-in (e.g. "https://tuwa.io").
   */
  expectedUri?: string | string[];

  /**
   * List of allowed CAIP-2 chain IDs (e.g. ["eip155:1", "solana:5eykt4UsFv8P8NJdTREpY1vzqKqZKvdpK"]).
   */
  allowedChainIds?: string[];

  /**
   * Whether the CAIP-122 message MUST include an `expirationTime`.
   * Strongly recommended for zero-infrastructure stateless demo profiles.
   */
  requireExpirationTime?: boolean;

  /**
   * Maximum allowed age of the message's `issuedAt` in seconds.
   * Prevents accepting stale sign-in messages.
   * @default 300 (5 minutes)
   */
  maxIssuedAtAgeSeconds?: number;

  /**
   * Maximum allowed session lifetime in seconds (expirationTime - issuedAt).
   */
  maxSessionLifetimeSeconds?: number;

  /**
   * Allowed clock skew in seconds when validating timestamps.
   * @default 60 (1 minute)
   */
  clockSkewSeconds?: number;

  /**
   * Whether to enforce the `notBefore` timestamp if present in the message.
   * @default true
   */
  enforceNotBefore?: boolean;
}

/**
 * Options for validating a CAIP-122 message object.
 */
export interface ValidateMessageOptions {
  /**
   * If true, skips the `expirationTime` validation check.
   * Not recommended for production use.
   */
  skipExpiration?: boolean;

  /**
   * Optional verification policy to enforce on the message fields.
   */
  policy?: SiwxVerificationPolicy;
}

/**
 * The result of a message validation operation.
 */
export interface SiwxValidationResult {
  /** Whether the message fields are valid. */
  valid: boolean;
  /** List of validation error messages, empty if valid. */
  errors: string[];
}

/**
 * A parsed CAIP-122 message, structurally identical to the fields used to build it.
 */
export type ParsedSiwxMessage = SiwxMessageFields;

/**
 * The payload submitted for signature verification.
 */
export interface SiwxVerifyPayload {
  /** The raw CAIP-122 compliant message string that was signed. */
  message: string;
  /** The signature produced by the wallet. */
  signature: string;
}

/**
 * The result of a signature verification operation.
 */
export interface SiwxVerifyResult {
  /** Whether the signature is valid and the message is authentic. */
  success: boolean;
  /**
   * The parsed message fields if verification succeeded.
   * Present only when `success` is true.
   */
  data?: ParsedSiwxMessage;
  /**
   * A human-readable error if verification failed.
   * Present only when `success` is false.
   */
  error?: string;
}

/**
 * A chain-specific adapter interface that all siwx chain packages must implement.
 */
export interface SiwxAdapter {
  /**
   * The CAIP-2 namespace this adapter handles.
   */
  namespace: SiwxChainNamespace;

  /**
   * Verifies a CAIP-122 payload signature.
   * @param payload - The message and signature to verify.
   * @returns A promise resolving to the verification result.
   */
  verify(payload: SiwxVerifyPayload): Promise<SiwxVerifyResult>;
}
