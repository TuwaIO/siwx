import { describe, expect, it } from 'vitest';

import { buildMessage } from '../buildMessage';
import type { SiwxMessageFields } from '../types';

/** Minimal valid fields with all required properties. */
const MINIMAL_FIELDS: SiwxMessageFields = {
  domain: 'app.tuwa.io',
  address: 'eip155:1:0xAb5801a7D398351b8bE11C439e05C5B3259aeC9B',
  uri: 'https://app.tuwa.io',
  version: '1',
  chainId: 'eip155:1',
  nonce: 'abc12345',
  issuedAt: '2026-08-06T08:00:00.000Z',
};

describe('buildMessage()', () => {
  it('builds a minimal CAIP-122 message with only required fields', () => {
    const result = buildMessage(MINIMAL_FIELDS);

    expect(result).toContain('app.tuwa.io wants you to sign in with your blockchain account:');
    expect(result).toContain('eip155:1:0xAb5801a7D398351b8bE11C439e05C5B3259aeC9B');
    expect(result).toContain('URI: https://app.tuwa.io');
    expect(result).toContain('Version: 1');
    expect(result).toContain('Chain ID: eip155:1');
    expect(result).toContain('Nonce: abc12345');
    expect(result).toContain('Issued At: 2026-08-06T08:00:00.000Z');
  });

  it('includes the statement when provided', () => {
    const result = buildMessage({ ...MINIMAL_FIELDS, statement: 'Sign in to TUWA.' });
    expect(result).toContain('Sign in to TUWA.');
  });

  it('includes optional expirationTime when provided', () => {
    const result = buildMessage({
      ...MINIMAL_FIELDS,
      expirationTime: '2026-08-06T09:00:00.000Z',
    });
    expect(result).toContain('Expiration Time: 2026-08-06T09:00:00.000Z');
  });

  it('includes optional notBefore when provided', () => {
    const result = buildMessage({
      ...MINIMAL_FIELDS,
      notBefore: '2026-08-06T07:00:00.000Z',
    });
    expect(result).toContain('Not Before: 2026-08-06T07:00:00.000Z');
  });

  it('includes optional requestId when provided', () => {
    const result = buildMessage({ ...MINIMAL_FIELDS, requestId: 'req-abc-123' });
    expect(result).toContain('Request ID: req-abc-123');
  });

  it('includes multiple resources as a bulleted list', () => {
    const result = buildMessage({
      ...MINIMAL_FIELDS,
      resources: ['https://app.tuwa.io/api', 'https://app.tuwa.io/dashboard'],
    });
    expect(result).toContain('Resources:');
    expect(result).toContain('- https://app.tuwa.io/api');
    expect(result).toContain('- https://app.tuwa.io/dashboard');
  });

  it('produces a Solana CAIP-122 message when using solana namespace', () => {
    const result = buildMessage({
      ...MINIMAL_FIELDS,
      address: 'solana:5eykt4UsFv8P8NJdTREpY1vzqKqZKvdpK:4sGjMW1sRLRbt4zvMKXQc9oFKhfffJyEBscCNVS1NTLG',
      chainId: 'solana:5eykt4UsFv8P8NJdTREpY1vzqKqZKvdpK',
    });
    expect(result).toContain('Chain ID: solana:5eykt4UsFv8P8NJdTREpY1vzqKqZKvdpK');
    expect(result).toContain('solana:5eykt4UsFv8P8NJdTREpY1vzqKqZKvdpK:4sGjMW1sRLRbt4zvMKXQc9oFKhfffJyEBscCNVS1NTLG');
  });

  it('builds the full message with ALL optional fields', () => {
    const result = buildMessage({
      ...MINIMAL_FIELDS,
      statement: 'Sign in to TUWA.',
      expirationTime: '2026-08-06T09:00:00.000Z',
      notBefore: '2026-08-06T07:00:00.000Z',
      requestId: 'req-xyz-999',
      resources: ['ipfs://bafybeiemxf5abjwjbikoz4mcb3a3dla6ual3jsgpdr4cjr3oz3evfyavhu/wiki/'],
    });

    const lines = result.split('\n');
    // Header is always line 0
    expect(lines[0]).toBe('app.tuwa.io wants you to sign in with your blockchain account:');
    expect(lines[1]).toBe('eip155:1:0xAb5801a7D398351b8bE11C439e05C5B3259aeC9B');
    // Blank line after address
    expect(lines[2]).toBe('');
    // Statement is line 3
    expect(lines[3]).toBe('Sign in to TUWA.');
    // Blank after statement
    expect(lines[4]).toBe('');
  });

  it('omits the statement section entirely when not provided', () => {
    const result = buildMessage(MINIMAL_FIELDS);
    expect(result).not.toContain('Sign in');
    // Ensures no double blank lines
    expect(result).not.toContain('\n\n\n');
  });

  it('does not include Resources section when resources is empty array', () => {
    const result = buildMessage({ ...MINIMAL_FIELDS, resources: [] });
    expect(result).not.toContain('Resources:');
  });
});
