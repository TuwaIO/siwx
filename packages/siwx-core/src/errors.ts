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
