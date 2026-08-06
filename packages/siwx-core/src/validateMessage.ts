/**
 * @fileoverview CAIP-122 message field validators.
 * Provides individual validators and a composite `validateMessage` function.
 */

import type { SiwxMessageFields, SiwxValidationResult } from './types';

/** Regex for RFC 3986 URI validation (basic subset). */
const URI_REGEX = /^https?:\/\/.+/;

/** Regex for ISO 8601 datetime string validation. */
const ISO_8601_REGEX = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d+)?(Z|[+-]\d{2}:\d{2})$/;

/** Regex for CAIP-10 address validation: `{namespace}:{chainRef}:{address}` */
const CAIP_10_REGEX = /^[a-z0-9]+:[a-zA-Z0-9-]+:.+$/;

/** Regex for CAIP-2 chain ID: `{namespace}:{reference}` */
const CAIP_2_REGEX = /^[a-z0-9]+:[a-zA-Z0-9-]+$/;

/**
 * Validates that the `domain` field is a non-empty string.
 *
 * @param domain - The domain string to validate.
 * @returns An error string if invalid, or undefined if valid.
 */
function validateDomain(domain: string): string | undefined {
  if (!domain || domain.trim().length === 0) {
    return 'domain must be a non-empty string.';
  }
  if (domain.includes('\n')) {
    return 'domain must not contain newline characters.';
  }
  return undefined;
}

/**
 * Validates that the `address` field is CAIP-10 compliant.
 *
 * @param address - The account address string to validate.
 * @returns An error string if invalid, or undefined if valid.
 */
function validateAddress(address: string): string | undefined {
  if (!CAIP_10_REGEX.test(address)) {
    return `address must be CAIP-10 compliant (namespace:chainRef:address). Got: "${address}"`;
  }
  return undefined;
}

/**
 * Validates that the `uri` field is a valid RFC 3986 URI.
 *
 * @param uri - The URI string to validate.
 * @returns An error string if invalid, or undefined if valid.
 */
function validateUri(uri: string): string | undefined {
  if (!URI_REGEX.test(uri)) {
    return `uri must be a valid RFC 3986 URI starting with http(s)://. Got: "${uri}"`;
  }
  return undefined;
}

/**
 * Validates that the `chainId` field is a valid CAIP-2 chain ID string.
 *
 * @param chainId - The chain ID string to validate.
 * @returns An error string if invalid, or undefined if valid.
 */
function validateChainId(chainId: string): string | undefined {
  if (!CAIP_2_REGEX.test(chainId)) {
    return `chainId must be a valid CAIP-2 identifier (namespace:reference). Got: "${chainId}"`;
  }
  return undefined;
}

/**
 * Validates that the `nonce` field is a non-empty alphanumeric string of at least 8 characters.
 *
 * @param nonce - The nonce string to validate.
 * @returns An error string if invalid, or undefined if valid.
 */
function validateNonce(nonce: string): string | undefined {
  if (!nonce || nonce.length < 8) {
    return `nonce must be at least 8 characters long. Got length: ${nonce?.length ?? 0}`;
  }
  if (!/^[a-zA-Z0-9]+$/.test(nonce)) {
    return `nonce must be alphanumeric. Got: "${nonce}"`;
  }
  return undefined;
}

/**
 * Validates that a datetime string is ISO 8601 compliant.
 *
 * @param value - The datetime string to validate.
 * @param fieldName - The field name for error context.
 * @returns An error string if invalid, or undefined if valid.
 */
function validateIsoDatetime(value: string, fieldName: string): string | undefined {
  if (!ISO_8601_REGEX.test(value)) {
    return `${fieldName} must be a valid ISO 8601 datetime string. Got: "${value}"`;
  }
  return undefined;
}

/**
 * Validates that the message's `expirationTime`, if present, has not yet passed.
 *
 * @param expirationTime - The ISO 8601 expiration datetime string.
 * @returns An error string if the session is expired, or undefined if valid.
 */
function validateExpiration(expirationTime: string): string | undefined {
  const expiresAt = new Date(expirationTime);
  if (isNaN(expiresAt.getTime())) {
    return `expirationTime is not a valid date: "${expirationTime}"`;
  }
  if (expiresAt < new Date()) {
    return `Message has expired. expirationTime was: ${expirationTime}`;
  }
  return undefined;
}

/**
 * Validates all fields of a CAIP-122 message object.
 * Collects all errors and returns them together rather than failing on the first.
 *
 * @param fields - The message fields to validate.
 * @returns A `SiwxValidationResult` with `valid: true` or a list of errors.
 *
 * @example
 * ```ts
 * const result = validateMessage(parsedMessage);
 * if (!result.valid) {
 *   console.error(result.errors);
 * }
 * ```
 */
export function validateMessage(
  fields: SiwxMessageFields,
  options?: { skipExpiration?: boolean },
): SiwxValidationResult {
  const errors: string[] = [];

  const domainError = validateDomain(fields.domain);
  if (domainError) errors.push(domainError);

  const addressError = validateAddress(fields.address);
  if (addressError) errors.push(addressError);

  const uriError = validateUri(fields.uri);
  if (uriError) errors.push(uriError);

  if (fields.version !== '1') {
    errors.push(`version must be "1". Got: "${fields.version}"`);
  }

  const chainIdError = validateChainId(fields.chainId);
  if (chainIdError) errors.push(chainIdError);

  const nonceError = validateNonce(fields.nonce);
  if (nonceError) errors.push(nonceError);

  const issuedAtError = validateIsoDatetime(fields.issuedAt, 'issuedAt');
  if (issuedAtError) errors.push(issuedAtError);

  if (fields.expirationTime) {
    const expirationFormatError = validateIsoDatetime(fields.expirationTime, 'expirationTime');
    if (expirationFormatError) {
      errors.push(expirationFormatError);
    } else if (!options?.skipExpiration) {
      const expirationError = validateExpiration(fields.expirationTime);
      if (expirationError) errors.push(expirationError);
    }
  }

  if (fields.notBefore) {
    const notBeforeError = validateIsoDatetime(fields.notBefore, 'notBefore');
    if (notBeforeError) errors.push(notBeforeError);
  }

  if (fields.statement && fields.statement.includes('\n')) {
    errors.push('statement must not contain newline characters.');
  }

  return { valid: errors.length === 0, errors };
}

/**
 * Generates a cryptographically secure random nonce string suitable for CAIP-122 messages.
 * Produces a 16-byte random hex string (32 characters).
 *
 * @returns A 32-character hexadecimal nonce string.
 *
 * @example
 * ```ts
 * const nonce = generateNonce(); // e.g., "a4f3b2c1d0e5f6789..."
 * ```
 */
export function generateNonce(): string {
  const array = new Uint8Array(16);
  globalThis.crypto.getRandomValues(array);
  return Array.from(array)
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}
