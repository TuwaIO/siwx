/**
 * @file CAIP-122 compliant message builder.
 * Generates the human-readable sign-in message string from structured fields.
 */

import { SiwxValidationError } from './errors';
import type { SiwxMessageFields } from './types';

const REQUIRED_FIELDS = ['domain', 'address', 'uri', 'version', 'chainId', 'nonce', 'issuedAt'] as const;
const SINGLE_LINE_FIELDS = [...REQUIRED_FIELDS, 'statement', 'expirationTime', 'notBefore', 'requestId'] as const;

/**
 * Formats CAIP-122 message fields into the plain-text message that the wallet signs (the EIP-4361 layout used by
 * CAIP-122). Optional fields are omitted when empty.
 *
 * Pure function. It only checks that the message can be built: every required field is a non-empty string and no
 * field contains a line break (which would add or change lines of the signed message). It does not check formats or
 * timing: run {@link validateMessage} for that, as verifiers do.
 *
 * @param fields - The message fields to format.
 * @returns The message lines joined with `\n`, ready to be signed and parseable by {@link parseMessage}.
 * @throws {@link SiwxValidationError} When a required field is missing or empty, or a field contains a line break.
 *
 * @example
 * ```ts
 * const message = buildMessage({
 *   domain: 'app.tuwa.io',
 *   address: 'eip155:1:0xAb5801a7D398351b8bE11C439e05C5B3259aeC9B',
 *   uri: 'https://app.tuwa.io',
 *   version: '1',
 *   chainId: 'eip155:1',
 *   nonce: 'abc123xyz',
 *   issuedAt: new Date().toISOString(),
 *   statement: 'Sign in to TUWA.',
 * });
 * ```
 */
export function buildMessage(fields: SiwxMessageFields): string {
  const errors: string[] = [];
  for (const name of REQUIRED_FIELDS) {
    const value: unknown = fields[name];
    if (typeof value !== 'string' || value.trim().length === 0) {
      errors.push(`${name} is required. Got: ${JSON.stringify(value) ?? 'undefined'}`);
    }
  }
  const hasLineBreak = (value: unknown) => typeof value === 'string' && /[\r\n]/.test(value);
  for (const name of SINGLE_LINE_FIELDS) {
    if (hasLineBreak(fields[name])) errors.push(`${name} must not contain line breaks.`);
  }
  if (fields.resources?.some(hasLineBreak)) errors.push('resources must not contain line breaks.');
  if (errors.length > 0) throw new SiwxValidationError(errors);

  const {
    domain,
    address,
    statement,
    uri,
    version,
    chainId,
    nonce,
    issuedAt,
    expirationTime,
    notBefore,
    requestId,
    resources,
  } = fields;

  const lines: string[] = [`${domain} wants you to sign in with your blockchain account:`, address, ''];

  if (statement) {
    lines.push(statement, '');
  }

  lines.push(`URI: ${uri}`, `Version: ${version}`, `Chain ID: ${chainId}`, `Nonce: ${nonce}`, `Issued At: ${issuedAt}`);

  if (expirationTime) {
    lines.push(`Expiration Time: ${expirationTime}`);
  }

  if (notBefore) {
    lines.push(`Not Before: ${notBefore}`);
  }

  if (requestId) {
    lines.push(`Request ID: ${requestId}`);
  }

  if (resources && resources.length > 0) {
    lines.push('Resources:');
    for (const resource of resources) {
      lines.push(`- ${resource}`);
    }
  }

  return lines.join('\n');
}
