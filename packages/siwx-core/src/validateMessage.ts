/**
 * @fileoverview CAIP-122 message field validators.
 * Provides individual validators and a composite `validateMessage` function.
 */

import type { SiwxMessageFields, SiwxValidationResult, SiwxVerificationPolicy, ValidateMessageOptions } from './types';

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
 * @param now - Optional reference date (defaults to current date).
 * @param clockSkewSeconds - Allowed clock skew in seconds (defaults to 0).
 * @returns An error string if the session is expired, or undefined if valid.
 */
function validateExpiration(
  expirationTime: string,
  now: Date = new Date(),
  clockSkewSeconds: number = 0,
): string | undefined {
  const expiresAt = new Date(expirationTime);
  if (isNaN(expiresAt.getTime())) {
    return `expirationTime is not a valid date: "${expirationTime}"`;
  }
  if (expiresAt.getTime() + clockSkewSeconds * 1000 < now.getTime()) {
    return `Message has expired. expirationTime was: ${expirationTime}`;
  }
  return undefined;
}

/**
 * Validates a CAIP-122 message object against an optional verification policy.
 *
 * @param fields - The message fields to validate.
 * @param policy - The verification policy to enforce.
 * @param now - Reference date for timestamp validations (defaults to new Date()).
 * @returns An array of policy violation error messages.
 */
export function validatePolicy(
  fields: SiwxMessageFields,
  policy?: SiwxVerificationPolicy,
  now: Date = new Date(),
): string[] {
  if (!policy) return [];
  const errors: string[] = [];

  // 1. Domain match
  if (policy.expectedDomain !== undefined) {
    const expected = Array.isArray(policy.expectedDomain) ? policy.expectedDomain : [policy.expectedDomain];
    const isDomainMatch = expected.some((d) => d.toLowerCase() === fields.domain.toLowerCase());
    if (!isDomainMatch) {
      errors.push(`Domain mismatch. Expected: [${expected.join(', ')}], Received: "${fields.domain}"`);
    }
  }

  // 2. URI match (supports exact match, origin matching, and subpath prefix matching)
  if (policy.expectedUri !== undefined) {
    const expected = Array.isArray(policy.expectedUri) ? policy.expectedUri : [policy.expectedUri];
    const isUriMatch = expected.some((exp) => {
      if (fields.uri === exp) return true;
      const cleanExp = exp.endsWith('/') ? exp.slice(0, -1) : exp;
      if (fields.uri.startsWith(`${cleanExp}/`)) return true;
      try {
        const fieldUrl = new URL(fields.uri);
        const expUrl = new URL(exp);
        return fieldUrl.origin.toLowerCase() === expUrl.origin.toLowerCase();
      } catch {
        return false;
      }
    });
    if (!isUriMatch) {
      errors.push(`URI mismatch. Expected: [${expected.join(', ')}], Received: "${fields.uri}"`);
    }
  }

  // 3. Allowed chain IDs
  if (policy.allowedChainIds !== undefined && policy.allowedChainIds.length > 0) {
    const fieldChainStr = String(fields.chainId);
    const fieldRawChain = fieldChainStr.includes(':') ? fieldChainStr.split(':').pop()! : fieldChainStr;
    const isChainAllowed = policy.allowedChainIds.some((allowed) => {
      const allowedStr = String(allowed);
      const allowedRaw = allowedStr.includes(':') ? allowedStr.split(':').pop()! : allowedStr;
      return allowedStr === fieldChainStr || allowedRaw === fieldRawChain;
    });
    if (!isChainAllowed) {
      errors.push(`Chain ID "${fields.chainId}" is not allowed. Allowed: [${policy.allowedChainIds.join(', ')}]`);
    }
  }

  // 4. Require expirationTime
  if (policy.requireExpirationTime && !fields.expirationTime) {
    errors.push('expirationTime is required by verification policy.');
  }

  const clockSkew = policy.clockSkewSeconds ?? 60;
  const issuedAtDate = new Date(fields.issuedAt);

  if (!isNaN(issuedAtDate.getTime())) {
    // 5. Max issuedAt age
    if (policy.maxIssuedAtAgeSeconds !== undefined) {
      const ageSeconds = (now.getTime() - issuedAtDate.getTime()) / 1000;
      if (ageSeconds > policy.maxIssuedAtAgeSeconds + clockSkew) {
        errors.push(
          `Message issuedAt "${fields.issuedAt}" is older than the allowed max age of ${policy.maxIssuedAtAgeSeconds} seconds`,
        );
      }
    }

    // 6. Future issuedAt beyond clock skew
    if (issuedAtDate.getTime() - now.getTime() > clockSkew * 1000) {
      errors.push(
        `Message issuedAt "${fields.issuedAt}" is in the future beyond allowed clock skew of ${clockSkew} seconds`,
      );
    }
  }

  // 7. NotBefore enforcement
  if (fields.notBefore && policy.enforceNotBefore !== false) {
    const notBeforeDate = new Date(fields.notBefore);
    if (!isNaN(notBeforeDate.getTime())) {
      if (notBeforeDate.getTime() - now.getTime() > clockSkew * 1000) {
        errors.push(`Message not valid before ${fields.notBefore}`);
      }
    }
  }

  // 8. Max session lifetime
  if (policy.maxSessionLifetimeSeconds !== undefined && fields.expirationTime) {
    const expiresAtDate = new Date(fields.expirationTime);
    if (!isNaN(expiresAtDate.getTime()) && !isNaN(issuedAtDate.getTime())) {
      const lifetimeSeconds = (expiresAtDate.getTime() - issuedAtDate.getTime()) / 1000;
      if (lifetimeSeconds > policy.maxSessionLifetimeSeconds) {
        errors.push(
          `Session lifetime of ${lifetimeSeconds} seconds exceeds maximum allowed lifetime of ${policy.maxSessionLifetimeSeconds} seconds`,
        );
      }
    }
  }

  return errors;
}

/**
 * Validates all fields of a CAIP-122 message object.
 * Collects all errors and returns them together rather than failing on the first.
 *
 * @param fields - The message fields to validate.
 * @param options - Optional validation options or verification policy.
 * @returns A `SiwxValidationResult` with `valid: true` or a list of errors.
 *
 * @example
 * ```ts
 * const result = validateMessage(parsedMessage, {
 *   policy: { expectedDomain: 'tuwa.io', requireExpirationTime: true },
 * });
 * if (!result.valid) {
 *   console.error(result.errors);
 * }
 * ```
 */
export function validateMessage(fields: SiwxMessageFields, options?: ValidateMessageOptions): SiwxValidationResult {
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

  const clockSkew = options?.policy?.clockSkewSeconds ?? 60;

  if (fields.expirationTime) {
    const expirationFormatError = validateIsoDatetime(fields.expirationTime, 'expirationTime');
    if (expirationFormatError) {
      errors.push(expirationFormatError);
    } else if (!options?.skipExpiration) {
      const expirationError = validateExpiration(fields.expirationTime, new Date(), clockSkew);
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

  // Enforce policy if supplied
  if (options?.policy) {
    const policyErrors = validatePolicy(fields, options.policy);
    errors.push(...policyErrors);
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

/**
 * Minimal interface for a SIWX session or parsed CAIP-122 message.
 */
export interface SiwxSessionLike {
  address: string;
  chainId?: string;
}

/**
 * Validates whether a SIWX session matches a target wallet address and optional chainId.
 * Handles EVM case-insensitivity, Solana case-sensitivity, and CAIP-10/CAIP-2 normalization.
 *
 * @param session - Active SIWX session or parsed message
 * @param targetAddress - Target account address (plain or CAIP-10)
 * @param targetChainId - Target chain reference or CAIP-2 identifier
 * @returns True if the session matches the target address and chainId; false otherwise.
 *
 * @example
 * ```ts
 * const isValid = isSessionMatchingTarget(session, '0x123...', 1);
 * ```
 */
export function isSessionMatchingTarget(
  session: SiwxSessionLike | null | undefined,
  targetAddress: string,
  targetChainId?: string | number,
): boolean {
  if (!session || !session.address || !targetAddress) {
    return false;
  }

  const sessionCaip10 = session.address;
  const isEvmSession = sessionCaip10.startsWith('eip155:');
  const isSolanaSession = sessionCaip10.startsWith('solana:');

  const rawTargetAddr = targetAddress.includes(':') ? targetAddress.split(':').pop()! : targetAddress;
  const sessionAccountAddr = sessionCaip10.includes(':') ? sessionCaip10.split(':').pop()! : sessionCaip10;

  const isEvmTarget = rawTargetAddr.startsWith('0x') || targetAddress.startsWith('eip155:');

  // 1. Cross-chain namespace mismatch check
  if (isEvmTarget && !isEvmSession) {
    return false;
  }
  if (!isEvmTarget && !isSolanaSession) {
    return false;
  }

  // 2. Account address equality check (case-insensitive for EVM, case-sensitive for Solana)
  const isAddressMatch = isEvmSession
    ? sessionAccountAddr.toLowerCase() === rawTargetAddr.toLowerCase()
    : sessionAccountAddr === rawTargetAddr;

  if (!isAddressMatch) {
    return false;
  }

  // 3. Optional chainId alignment check
  if (targetChainId !== undefined && targetChainId !== null) {
    const rawTargetChain = String(targetChainId);
    const expectedCaip2 = isEvmSession
      ? rawTargetChain.startsWith('eip155:')
        ? rawTargetChain
        : `eip155:${rawTargetChain}`
      : rawTargetChain.startsWith('solana:')
        ? rawTargetChain
        : `solana:${rawTargetChain}`;

    if (session.chainId && session.chainId !== expectedCaip2 && session.chainId !== rawTargetChain) {
      return false;
    }
  }

  return true;
}
