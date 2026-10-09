/**
 * @file CAIP-122 message parser.
 * Converts a raw CAIP-122 compliant message string back into structured fields.
 */

import { SiwxParseError } from './errors';
import type { ParsedSiwxMessage, SiwxChainId } from './types';
import { AUTHORITY_REGEX } from './validateMessage';

/**
 * Regex to parse the CAIP-122 header line: `{domain} wants you to sign in with your blockchain account:`. The domain
 * must be an RFC 3986 authority, so bytes that are not a sign-in message (for example a Solana off-chain message
 * envelope decoded as text) are rejected instead of becoming part of the domain.
 */
const HEADER_REGEX = new RegExp(
  `^(?<domain>${AUTHORITY_REGEX.source.slice(1, -1)}) wants you to sign in with your blockchain account:$`,
);

/** Regex to match labeled field lines like `URI: value` */
const FIELD_REGEX = /^(?<key>[A-Za-z ]+): (?<value>.+)$/;

/** Regex to match resource list items */
const RESOURCE_REGEX = /^- (?<resource>.+)$/;

/**
 * Parses a CAIP-122 message string (as produced by {@link buildMessage}) back into its fields.
 *
 * Pure function. It checks the message structure and the presence of the required fields (`URI`, `Version`,
 * `Chain ID`, `Nonce`, `Issued At`) but not their format or timing; use {@link validateMessage} for that.
 *
 * @param message - The raw message string that was signed.
 * @returns The fields found in the message. `version` and `chainId` are taken as written, without validation.
 * @throws {@link SiwxParseError} If the header or the blank separator lines are malformed, or a required field is
 * missing.
 *
 * @example
 * ```ts
 * const parsed = parseMessage(rawMessageString);
 * console.log(parsed.address); // "eip155:1:0xAb5..."
 * ```
 */
export function parseMessage(message: string): ParsedSiwxMessage {
  const lines = message.split('\n');

  if (lines.length < 5) {
    throw new SiwxParseError('Message is too short to be a valid CAIP-122 message.');
  }

  // Line 0: domain header
  const headerMatch = lines[0]?.match(HEADER_REGEX);
  if (!headerMatch?.groups?.['domain']) {
    throw new SiwxParseError(
      `Invalid CAIP-122 header line. Expected: "{domain} wants you to sign in with your blockchain account:"`,
    );
  }
  const domain = headerMatch.groups['domain'];

  // Line 1: address (CAIP-10)
  const address = lines[1];
  if (!address) {
    throw new SiwxParseError('Missing address on line 2.');
  }

  // Line 2: must be blank
  if (lines[2] !== '') {
    throw new SiwxParseError('Expected blank line after address (line 3).');
  }

  let lineIndex = 3;
  let statement: string | undefined;

  // Optional statement: if next line is not a labeled field, it's the statement
  if (lines[lineIndex] && !FIELD_REGEX.test(lines[lineIndex]!)) {
    statement = lines[lineIndex];
    lineIndex++;
    // After statement, there should be a blank line
    if (lines[lineIndex] !== '') {
      throw new SiwxParseError('Expected blank line after statement.');
    }
    lineIndex++;
  }

  // Parse labeled fields
  const fields: Record<string, string> = {};
  const resources: string[] = [];
  let parsingResources = false;

  while (lineIndex < lines.length) {
    const line = lines[lineIndex];
    if (line === undefined) {
      lineIndex++;
      continue;
    }

    if (line === 'Resources:') {
      parsingResources = true;
      lineIndex++;
      continue;
    }

    if (parsingResources) {
      const resourceMatch = line.match(RESOURCE_REGEX);
      if (resourceMatch?.groups?.['resource']) {
        resources.push(resourceMatch.groups['resource']);
        lineIndex++;
        continue;
      }
      // If a resource line doesn't match, stop parsing resources
      parsingResources = false;
    }

    const fieldMatch = line.match(FIELD_REGEX);
    if (fieldMatch?.groups?.['key'] && fieldMatch.groups['value']) {
      fields[fieldMatch.groups['key']] = fieldMatch.groups['value'];
    }

    lineIndex++;
  }

  // Validate required fields
  const requiredFields = ['URI', 'Version', 'Chain ID', 'Nonce', 'Issued At'] as const;
  for (const field of requiredFields) {
    if (!fields[field]) {
      throw new SiwxParseError(`Missing required field in CAIP-122 message: "${field}"`);
    }
  }

  return {
    domain,
    address,
    statement,
    uri: fields['URI']!,
    version: fields['Version'] as '1',
    chainId: fields['Chain ID'] as SiwxChainId,
    nonce: fields['Nonce']!,
    issuedAt: fields['Issued At']!,
    expirationTime: fields['Expiration Time'],
    notBefore: fields['Not Before'],
    requestId: fields['Request ID'],
    resources: resources.length > 0 ? resources : undefined,
  };
}
