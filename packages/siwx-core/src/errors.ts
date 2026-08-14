/**
 * @fileoverview Error classes for the @tuwaio/siwx-core package.
 * All errors are typed and carry contextual information for proper handling.
 */

/**
 * Base error class for all siwx-related errors.
 * Extends the native Error with an optional error code for programmatic handling.
 */
export class SiwxError extends Error {
  /**
   * @param message - Human-readable description of the error.
   * @param code - Optional machine-readable error code.
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
 * Thrown when a CAIP-122 message string cannot be parsed.
 * This indicates the message is malformed or not CAIP-122 compliant.
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
 * Thrown when one or more fields in a SiwxMessage fail validation.
 * The `errors` property contains a list of all validation failures.
 */
export class SiwxValidationError extends SiwxError {
  /**
   * @param errors - Array of validation error descriptions.
   */
  constructor(public readonly errors: string[]) {
    super(`CAIP-122 message validation failed: ${errors.join(', ')}`, 'SIWX_VALIDATION_ERROR');
    this.name = 'SiwxValidationError';
  }
}

/**
 * Thrown when a signature verification operation fails.
 * Indicates the signature is invalid, the message was tampered with,
 * or the signer address does not match.
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
 * Thrown when the session or message has expired based on the `expirationTime` field.
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
 * Thrown when a nonce replay attack is detected, i.e., the nonce has already been used.
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
 * Thrown when the chain namespace in the message is not supported.
 */
export class SiwxUnsupportedNamespaceError extends SiwxError {
  /**
   * @param namespace - The unsupported namespace string extracted from the message.
   */
  constructor(public readonly namespace: string) {
    super(`Unsupported CAIP-2 namespace: "${namespace}". Supported: eip155, solana`, 'SIWX_UNSUPPORTED_NAMESPACE');
    this.name = 'SiwxUnsupportedNamespaceError';
  }
}

/**
 * Thrown when a verification policy rule is violated.
 */
export class SiwxPolicyViolationError extends SiwxError {
  /**
   * @param message - Human-readable description of policy violation.
   * @param code - Specific policy violation error code.
   */
  constructor(message: string, code: string = 'SIWX_POLICY_VIOLATION') {
    super(message, code);
    this.name = 'SiwxPolicyViolationError';
  }
}

/**
 * Thrown when the message domain does not match the expected domain policy.
 */
export class SiwxDomainMismatchError extends SiwxPolicyViolationError {
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
 * Thrown when the message URI does not match the expected URI policy.
 */
export class SiwxUriMismatchError extends SiwxPolicyViolationError {
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
 * Thrown when the message chain ID is not in the allowed list of chain IDs.
 */
export class SiwxChainNotAllowedError extends SiwxPolicyViolationError {
  constructor(
    public readonly allowedChainIds: string[],
    public readonly received: string,
  ) {
    super(`Chain ID "${received}" is not allowed. Allowed: [${allowedChainIds.join(', ')}]`, 'SIWX_CHAIN_NOT_ALLOWED');
    this.name = 'SiwxChainNotAllowedError';
  }
}

/**
 * Thrown when the message issuedAt timestamp is older than allowed by policy.
 */
export class SiwxIssuedAtStaleError extends SiwxPolicyViolationError {
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
 * Thrown when the message issuedAt timestamp is in the future beyond acceptable clock skew.
 */
export class SiwxIssuedAtFutureError extends SiwxPolicyViolationError {
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
 * Thrown when the message notBefore timestamp has not yet been reached.
 */
export class SiwxNotBeforeError extends SiwxPolicyViolationError {
  constructor(public readonly notBefore: string) {
    super(`Message not valid before ${notBefore}`, 'SIWX_NOT_BEFORE');
    this.name = 'SiwxNotBeforeError';
  }
}

/**
 * Thrown when the message session duration exceeds the max allowed session lifetime.
 */
export class SiwxSessionLifetimeExceededError extends SiwxPolicyViolationError {
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
