/**
 * @file Core type definitions for the CAIP-122 (Sign-In With X) standard.
 * These types are chain-agnostic and are shared by every SIWX package.
 *
 * @see {@link https://github.com/ChainAgnostic/CAIPs/blob/main/CAIPs/caip-122.md CAIP-122 Specification}
 */

/**
 * CAIP-2 chain namespaces supported by SIWX: `eip155` (EVM) and `solana`.
 */
export type SiwxChainNamespace = 'eip155' | 'solana';

/**
 * A CAIP-2 chain ID in a supported namespace: `{namespace}:{reference}`.
 *
 * @example "eip155:1" (Ethereum Mainnet)
 * @example "solana:5eykt4UsFv8P8NJdTREpY1vzqKqZKvdpK" (Solana Mainnet)
 */
export type SiwxChainId = `${SiwxChainNamespace}:${string}`;

/**
 * Lifecycle status of a client-side sign-in.
 *
 * `@tuwaio/siwx-react` moves through `idle` → `building` (nonce and message) → `signing` (wallet prompt) →
 * `verifying` (backend) → `authenticated` or `error`.
 */
export type SiwxStatus = 'idle' | 'building' | 'signing' | 'verifying' | 'authenticated' | 'error';

/**
 * Fields of a CAIP-122 sign-in message. They are the input of `buildMessage` and the output of
 * `parseMessage`; `validateMessage` checks their format.
 */
export interface SiwxMessageFields {
  /**
   * RFC 3986 authority (host and optional port) requesting the sign-in, without a scheme.
   * @example "app.tuwa.io"
   */
  domain: string;

  /**
   * CAIP-10 account ID of the signer: `{namespace}:{chainReference}:{address}`.
   * @example "eip155:1:0xAb5801a7D398351b8bE11C439e05C5B3259aeC9B"
   */
  address: string;

  /**
   * Optional human-readable statement shown to the user. Must be a single line: `validateMessage`
   * rejects statements that contain `\n`.
   */
  statement?: string;

  /**
   * RFC 3986 URI of the resource that is the subject of the sign-in. `validateMessage` requires an
   * `http://` or `https://` URI.
   * @example "https://app.tuwa.io"
   */
  uri: string;

  /**
   * Version of the CAIP-122 message format. Always `"1"`.
   */
  version: '1';

  /**
   * CAIP-2 chain ID the session is bound to.
   * @example "eip155:1"
   */
  chainId: SiwxChainId;

  /**
   * Random value that binds the signature to one sign-in attempt and prevents replay. `validateMessage`
   * requires at least 8 alphanumeric characters; `generateNonce` returns 32 hex characters.
   * @example "a4f3b2c1d0e5f6789abc0123456789ab"
   */
  nonce: string;

  /**
   * ISO 8601 date-time when the message was created.
   * @example "2026-08-06T08:00:00.000Z"
   */
  issuedAt: string;

  /**
   * Optional ISO 8601 date-time after which the signed message is no longer valid.
   */
  expirationTime?: string;

  /**
   * Optional ISO 8601 date-time before which the signed message is not yet valid. `validateMessage` rejects the
   * message until then.
   */
  notBefore?: string;

  /**
   * Optional system-specific identifier of the request.
   */
  requestId?: string;

  /**
   * Optional list of URIs the user wishes to have resolved as part of the sign-in.
   */
  resources?: string[];
}

/**
 * Rules that bind a CAIP-122 message to your application. Enforced by {@link validatePolicy}, and by
 * {@link validateMessage} when passed in its options.
 *
 * Every rule below is optional and is skipped when its field is omitted. Two timing rules always apply, even without
 * a policy in {@link validateMessage}: messages whose `issuedAt` lies in the future beyond `clockSkewSeconds` are
 * rejected, and so are (unless `enforceNotBefore` is `false`) messages whose `notBefore` has not been reached.
 * Always set at least `expectedDomain` on the server.
 */
export interface SiwxVerificationPolicy {
  /**
   * Accepted value(s) of the message `domain`, compared case-insensitively.
   * @example "tuwa.io"
   * @example ["tuwa.io", "staging.tuwa.io"]
   */
  expectedDomain?: string | string[];

  /**
   * Accepted value(s) of the message `uri`. A message URI matches an expected URI when it is equal to it,
   * starts with it followed by `/`, or has the same origin (scheme, host and port).
   * @example "https://tuwa.io"
   */
  expectedUri?: string | string[];

  /**
   * Allowed CAIP-2 chain IDs. The message `chainId` must equal one of them exactly (bare references such as `"1"`
   * never match). An empty array allows every chain.
   * @example ["eip155:1", "solana:5eykt4UsFv8P8NJdTREpY1vzqKqZKvdpK"]
   */
  allowedChainIds?: string[];

  /**
   * Rejects messages without an `expirationTime`. Recommended for the stateless demo profile of
   * `@tuwaio/siwx-server`.
   */
  requireExpirationTime?: boolean;

  /**
   * Maximum age of the message `issuedAt`, in seconds (plus `clockSkewSeconds`). Rejects stale messages.
   * There is no default: when omitted, the age is not checked.
   */
  maxIssuedAtAgeSeconds?: number;

  /**
   * Maximum signed session lifetime (`expirationTime - issuedAt`), in seconds. Checked only when the message
   * has an `expirationTime`.
   */
  maxSessionLifetimeSeconds?: number;

  /**
   * Allowed clock difference between signer and verifier, in seconds. Applied to `issuedAt`, `notBefore` and
   * `expirationTime` checks.
   * @default 60
   */
  clockSkewSeconds?: number;

  /**
   * Rejects messages whose `notBefore` is still in the future (beyond `clockSkewSeconds`).
   * @default true
   */
  enforceNotBefore?: boolean;
}

/**
 * Options of {@link validateMessage}.
 */
export interface ValidateMessageOptions {
  /**
   * Skips the check that `expirationTime` has not passed (the format is still checked).
   * Not recommended in production.
   */
  skipExpiration?: boolean;

  /**
   * Verification policy to enforce on top of the format checks. See {@link validatePolicy}.
   */
  policy?: SiwxVerificationPolicy;
}

/**
 * Result of {@link validateMessage}.
 */
export interface SiwxValidationResult {
  /** `true` when no check failed. */
  valid: boolean;
  /** Human-readable description of every failed check; empty when `valid` is `true`. */
  errors: string[];
}

/**
 * A CAIP-122 message parsed by `parseMessage`. Same shape as {@link SiwxMessageFields}.
 */
export type ParsedSiwxMessage = SiwxMessageFields;

/**
 * A signed CAIP-122 message, as sent from the client to the verifier.
 */
export interface SiwxVerifyPayload {
  /** The exact CAIP-122 message string that was signed. */
  message: string;
  /** The wallet signature: hex (`0x…`) for EVM, base58 for Solana. */
  signature: string;
}

/**
 * Result of a signature verification. Verification functions return this object instead of throwing.
 */
export interface SiwxVerifyResult {
  /** `true` when the message is valid and the signature matches its `address`. */
  success: boolean;
  /**
   * The parsed message. Present only when `success` is `true`.
   */
  data?: ParsedSiwxMessage;
  /**
   * Human-readable reason of the failure. Present only when `success` is `false`.
   */
  error?: string;
}

/**
 * Shape of a verifier for one CAIP-2 namespace.
 *
 * The SIWX packages do not implement or consume this interface: the chain packages export plain functions
 * (`verifyEvmSignature` in `@tuwaio/siwx-evm`, `verifyEd25519` in `@tuwaio/siwx-solana`) that you can wrap into it
 * to build your own namespace registry.
 */
export interface SiwxAdapter {
  /**
   * CAIP-2 namespace handled by the adapter.
   */
  namespace: SiwxChainNamespace;

  /**
   * Verifies a signed CAIP-122 message.
   * @param payload - The message and signature to verify.
   * @returns A promise resolving to the verification result.
   */
  verify(payload: SiwxVerifyPayload): Promise<SiwxVerifyResult>;
}
