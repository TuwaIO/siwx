/**
 * @file Error classes for the @tuwaio/siwx-core package.
 * All errors are typed and carry contextual information for proper handling.
 */

/**
 * Base class of every SIWX error. Extends the native `Error` with a machine-readable `code` (for example
 * `SIWX_PARSE_ERROR`) for programmatic handling; `name` is set to the concrete class name.
 */
export class SiwxError extends Error {
  /**
   * @param message - Human-readable description of the error.
   * @param code - Machine-readable error code, for example `SIWX_PARSE_ERROR`. Each subclass passes its own code;
   * `SIWX_ERROR` is used only by the base class.
   */
  constructor(
    message: string,
    public readonly code: string = 'SIWX_ERROR',
  ) {
    super(message);
    this.name = 'SiwxError';
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

/**
 * Thrown by {@link parseMessage} when a string is not a well-formed CAIP-122 message (wrong header, missing
 * blank lines or missing required fields). Code: `SIWX_PARSE_ERROR`.
 */
export class SiwxParseError extends SiwxError {
  /**
   * @param message - Human-readable description of the parse failure.
   */
  constructor(message: string) {
    super(message, 'SIWX_PARSE_ERROR');
    this.name = 'SiwxParseError';
  }
}

/**
 * Signals that one or more message fields failed validation; `errors` lists every failure.
 * Code: `SIWX_VALIDATION_ERROR`.
 *
 * The chain verifiers (`verifyEip191`, `verifyEip1271`, `verifyEd25519`) raise it internally and return its
 * message in `SiwxVerifyResult.error`. {@link validateMessage} returns a result instead of throwing it.
 */
export class SiwxValidationError extends SiwxError {
  /**
   * @param errors - Descriptions of the failed checks, as returned by {@link validateMessage}.
   */
  constructor(public readonly errors: string[]) {
    super(`CAIP-122 message validation failed: ${errors.join(', ')}`, 'SIWX_VALIDATION_ERROR');
    this.name = 'SiwxValidationError';
  }
}

/**
 * Signals a failed signature check: the signature is invalid, the message was altered, or the signer does not
 * match the message `address`. Code: `SIWX_VERIFICATION_ERROR`.
 *
 * The chain verifiers raise it internally and return its message in `SiwxVerifyResult.error`.
 */
export class SiwxVerificationError extends SiwxError {
  /**
   * @param message - Human-readable description of the verification failure.
   */
  constructor(message: string) {
    super(message, 'SIWX_VERIFICATION_ERROR');
    this.name = 'SiwxVerificationError';
  }
}

/**
 * Signals that the message `expirationTime` has passed. Code: `SIWX_EXPIRED_SESSION`.
 *
 * Not thrown by SIWX itself: expired messages are reported by {@link validateMessage} and returned as `error` by the
 * verifiers. Provided for applications that want to throw a typed error from their own checks.
 */
export class SiwxExpiredSessionError extends SiwxError {
  /**
   * @param expirationTime - The ISO 8601 timestamp when the session expired.
   */
  constructor(public readonly expirationTime: string) {
    super(`SIWX session expired at ${expirationTime}`, 'SIWX_EXPIRED_SESSION');
    this.name = 'SiwxExpiredSessionError';
  }
}

/**
 * Signals that the message nonce has already been used. Code: `SIWX_NONCE_REPLAY`.
 *
 * `verifySiwxPayload` (`@tuwaio/siwx-server`) raises it internally when the nonce is in `usedNonces` and returns
 * its message in the result.
 */
export class SiwxNonceReplayError extends SiwxError {
  /**
   * @param nonce - The nonce that was detected as replayed.
   */
  constructor(public readonly nonce: string) {
    super(`Nonce has already been used: ${nonce}`, 'SIWX_NONCE_REPLAY');
    this.name = 'SiwxNonceReplayError';
  }
}

/**
 * Signals a CAIP-2 namespace that is not supported (anything other than `eip155` and `solana`), or not supported
 * by the verifier that received the message. Code: `SIWX_UNSUPPORTED_NAMESPACE`.
 *
 * The chain verifiers and `verifySiwxPayload` raise it internally and report it through their result.
 */
export class SiwxUnsupportedNamespaceError extends SiwxError {
  /**
   * @param namespace - The namespace extracted from the message `chainId`.
   */
  constructor(public readonly namespace: string) {
    super(`Unsupported CAIP-2 namespace: "${namespace}". Supported: eip155, solana`, 'SIWX_UNSUPPORTED_NAMESPACE');
    this.name = 'SiwxUnsupportedNamespaceError';
  }
}

/**
 * Base class of the policy violation errors. Code: `SIWX_POLICY_VIOLATION`, or a specific code set by a subclass.
 *
 * The SIWX functions report policy violations as strings (see {@link validatePolicy}) and never throw this class or
 * its subclasses. They are provided for applications that want to throw typed errors from their own checks.
 */
export class SiwxPolicyViolationError extends SiwxError {
  /**
   * @param message - Human-readable description of the violation.
   * @param code - Machine-readable error code. Defaults to `SIWX_POLICY_VIOLATION`.
   */
  constructor(message: string, code: string = 'SIWX_POLICY_VIOLATION') {
    super(message, code);
    this.name = 'SiwxPolicyViolationError';
  }
}

/**
 * Policy violation: the message `domain` is not one of the expected domains. Code: `SIWX_DOMAIN_MISMATCH`.
 * Not thrown by SIWX itself; see {@link SiwxPolicyViolationError}.
 */
export class SiwxDomainMismatchError extends SiwxPolicyViolationError {
  /**
   * @param expected - The expected domain or domains.
   * @param received - The `domain` found in the message.
   */
  constructor(
    public readonly expected: string | string[],
    public readonly received: string,
  ) {
    const expectedStr = Array.isArray(expected) ? expected.join(', ') : expected;
    super(`Domain mismatch. Expected: [${expectedStr}], Received: "${received}"`, 'SIWX_DOMAIN_MISMATCH');
    this.name = 'SiwxDomainMismatchError';
  }
}

/**
 * Policy violation: the message `uri` does not match the expected URIs. Code: `SIWX_URI_MISMATCH`.
 * Not thrown by SIWX itself; see {@link SiwxPolicyViolationError}.
 */
export class SiwxUriMismatchError extends SiwxPolicyViolationError {
  /**
   * @param expected - The expected URI or URIs.
   * @param received - The `uri` found in the message.
   */
  constructor(
    public readonly expected: string | string[],
    public readonly received: string,
  ) {
    const expectedStr = Array.isArray(expected) ? expected.join(', ') : expected;
    super(`URI mismatch. Expected: [${expectedStr}], Received: "${received}"`, 'SIWX_URI_MISMATCH');
    this.name = 'SiwxUriMismatchError';
  }
}

/**
 * Policy violation: the message `chainId` is not in the allowed list. Code: `SIWX_CHAIN_NOT_ALLOWED`.
 * Not thrown by SIWX itself; see {@link SiwxPolicyViolationError}.
 */
export class SiwxChainNotAllowedError extends SiwxPolicyViolationError {
  /**
   * @param allowedChainIds - The allowed CAIP-2 chain IDs.
   * @param received - The `chainId` found in the message.
   */
  constructor(
    public readonly allowedChainIds: string[],
    public readonly received: string,
  ) {
    super(`Chain ID "${received}" is not allowed. Allowed: [${allowedChainIds.join(', ')}]`, 'SIWX_CHAIN_NOT_ALLOWED');
    this.name = 'SiwxChainNotAllowedError';
  }
}

/**
 * Policy violation: the message `issuedAt` is older than the allowed maximum age. Code: `SIWX_ISSUED_AT_STALE`.
 * Not thrown by SIWX itself; see {@link SiwxPolicyViolationError}.
 */
export class SiwxIssuedAtStaleError extends SiwxPolicyViolationError {
  /**
   * @param issuedAt - The `issuedAt` found in the message.
   * @param maxAgeSeconds - The allowed maximum age, in seconds.
   */
  constructor(
    public readonly issuedAt: string,
    public readonly maxAgeSeconds: number,
  ) {
    super(
      `Message issuedAt "${issuedAt}" is older than the allowed max age of ${maxAgeSeconds} seconds`,
      'SIWX_ISSUED_AT_STALE',
    );
    this.name = 'SiwxIssuedAtStaleError';
  }
}

/**
 * Policy violation: the message `issuedAt` lies in the future beyond the allowed clock skew.
 * Code: `SIWX_ISSUED_AT_FUTURE`. Not thrown by SIWX itself; see {@link SiwxPolicyViolationError}.
 */
export class SiwxIssuedAtFutureError extends SiwxPolicyViolationError {
  /**
   * @param issuedAt - The `issuedAt` found in the message.
   * @param clockSkewSeconds - The allowed clock skew, in seconds.
   */
  constructor(
    public readonly issuedAt: string,
    public readonly clockSkewSeconds: number,
  ) {
    super(
      `Message issuedAt "${issuedAt}" is in the future beyond allowed clock skew of ${clockSkewSeconds} seconds`,
      'SIWX_ISSUED_AT_FUTURE',
    );
    this.name = 'SiwxIssuedAtFutureError';
  }
}

/**
 * Policy violation: the message `notBefore` has not been reached yet. Code: `SIWX_NOT_BEFORE`.
 * Not thrown by SIWX itself; see {@link SiwxPolicyViolationError}.
 */
export class SiwxNotBeforeError extends SiwxPolicyViolationError {
  /**
   * @param notBefore - The `notBefore` found in the message.
   */
  constructor(public readonly notBefore: string) {
    super(`Message not valid before ${notBefore}`, 'SIWX_NOT_BEFORE');
    this.name = 'SiwxNotBeforeError';
  }
}

/**
 * Policy violation: `expirationTime - issuedAt` exceeds the allowed maximum lifetime.
 * Code: `SIWX_SESSION_LIFETIME_EXCEEDED`. Not thrown by SIWX itself; see {@link SiwxPolicyViolationError}.
 */
export class SiwxSessionLifetimeExceededError extends SiwxPolicyViolationError {
  /**
   * @param lifetimeSeconds - The lifetime of the message, in seconds.
   * @param maxLifetimeSeconds - The allowed maximum lifetime, in seconds.
   */
  constructor(
    public readonly lifetimeSeconds: number,
    public readonly maxLifetimeSeconds: number,
  ) {
    super(
      `Session lifetime of ${lifetimeSeconds} seconds exceeds maximum allowed lifetime of ${maxLifetimeSeconds} seconds`,
      'SIWX_SESSION_LIFETIME_EXCEEDED',
    );
    this.name = 'SiwxSessionLifetimeExceededError';
  }
}
