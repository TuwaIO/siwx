/**
 * @file CAIP-122 compliant message builder.
 * Generates the human-readable sign-in message string from structured fields.
 */

import type { SiwxMessageFields } from './types';

/**
 * Formats CAIP-122 message fields into the plain-text message that the wallet signs (the EIP-4361 layout used by
 * CAIP-122). Optional fields are omitted when empty.
 *
 * Pure function: it does not validate the fields. Run {@link validateMessage} first if the input is untrusted.
 *
 * @param fields - The message fields to format.
 * @returns The message lines joined with `\n`, ready to be signed and parseable by {@link parseMessage}.
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
