import { describe, expect, it } from 'vitest';

import type { SiwxMessageFields } from '../types';
import { generateNonce, validateMessage } from '../validateMessage';

/** A fully valid message baseline. Future-dated expiration avoids flakiness. */
const VALID_FIELDS: SiwxMessageFields = {
  domain: 'app.tuwa.io',
  address: 'eip155:1:0xAb5801a7D398351b8bE11C439e05C5B3259aeC9B',
  uri: 'https://app.tuwa.io',
  version: '1',
  chainId: 'eip155:1',
  nonce: 'a4f3b2c1d0e5f678',
  issuedAt: '2026-08-06T08:00:00.000Z',
  expirationTime: '2099-01-01T00:00:00.000Z',
};

describe('validateMessage()', () => {
  it('returns valid: true for a fully valid message', () => {
    const result = validateMessage(VALID_FIELDS);
    expect(result.valid).toBe(true);
    expect(result.errors).toHaveLength(0);
  });

  it('returns valid: true for minimal fields (no optional fields)', () => {
    const minimal = { ...VALID_FIELDS, expirationTime: undefined };
    const result = validateMessage(minimal);
    expect(result.valid).toBe(true);
  });

  describe('domain validation', () => {
    it('fails on empty domain', () => {
      const result = validateMessage({ ...VALID_FIELDS, domain: '' });
      expect(result.valid).toBe(false);
      expect(result.errors.some((e) => e.includes('domain'))).toBe(true);
    });

    it('fails on domain containing newline', () => {
      const result = validateMessage({ ...VALID_FIELDS, domain: 'app.tuwa.io\nevil.com' });
      expect(result.valid).toBe(false);
      expect(result.errors.some((e) => e.includes('domain'))).toBe(true);
    });
  });

  describe('address validation', () => {
    it('fails on a plain EVM address without CAIP-10 namespace', () => {
      const result = validateMessage({
        ...VALID_FIELDS,
        address: '0xAb5801a7D398351b8bE11C439e05C5B3259aeC9B',
      });
      expect(result.valid).toBe(false);
      expect(result.errors.some((e) => e.includes('address'))).toBe(true);
    });

    it('fails on a two-segment address (missing account part)', () => {
      const result = validateMessage({ ...VALID_FIELDS, address: 'eip155:1' });
      expect(result.valid).toBe(false);
      expect(result.errors.some((e) => e.includes('address'))).toBe(true);
    });

    it('accepts a valid Solana CAIP-10 address', () => {
      const result = validateMessage({
        ...VALID_FIELDS,
        address: 'solana:5eykt4UsFv8P8NJdTREpY1vzqKqZKvdpK:4sGjMW1sRLRbt4zvMKXQc9oFKhfffJyEBscCNVS1NTLG',
        chainId: 'solana:5eykt4UsFv8P8NJdTREpY1vzqKqZKvdpK',
        // Skip future expiry just for this test
        expirationTime: undefined,
      });
      expect(result.valid).toBe(true);
    });
  });

  describe('URI validation', () => {
    it('fails on a non-HTTP URI', () => {
      const result = validateMessage({ ...VALID_FIELDS, uri: 'ipfs://example' });
      expect(result.valid).toBe(false);
      expect(result.errors.some((e) => e.includes('uri'))).toBe(true);
    });

    it('fails on an empty URI', () => {
      const result = validateMessage({ ...VALID_FIELDS, uri: '' });
      expect(result.valid).toBe(false);
      expect(result.errors.some((e) => e.includes('uri'))).toBe(true);
    });

    it('accepts an HTTPS URI', () => {
      const result = validateMessage({ ...VALID_FIELDS, uri: 'https://secure.tuwa.io', expirationTime: undefined });
      expect(result.valid).toBe(true);
    });
  });

  describe('version validation', () => {
    it('fails when version is not "1"', () => {
      // Force invalid version via type cast for testing
      const result = validateMessage({ ...VALID_FIELDS, version: '2' as '1' });
      expect(result.valid).toBe(false);
      expect(result.errors.some((e) => e.includes('version'))).toBe(true);
    });
  });

  describe('chainId validation', () => {
    it('fails on a chainId without a namespace separator', () => {
      const result = validateMessage({ ...VALID_FIELDS, chainId: 'eip155' as `eip155:${string}` });
      expect(result.valid).toBe(false);
      expect(result.errors.some((e) => e.includes('chainId'))).toBe(true);
    });

    it('accepts a valid Solana chainId', () => {
      const result = validateMessage({
        ...VALID_FIELDS,
        chainId: 'solana:5eykt4UsFv8P8NJdTREpY1vzqKqZKvdpK',
        address: 'solana:5eykt4UsFv8P8NJdTREpY1vzqKqZKvdpK:4sGjMW1sRLRbt4zvMKXQc9oFKhfffJyEBscCNVS1NTLG',
        expirationTime: undefined,
      });
      expect(result.valid).toBe(true);
    });
  });

  describe('nonce validation', () => {
    it('fails when nonce is shorter than 8 characters', () => {
      const result = validateMessage({ ...VALID_FIELDS, nonce: 'abc' });
      expect(result.valid).toBe(false);
      expect(result.errors.some((e) => e.includes('nonce'))).toBe(true);
    });

    it('fails when nonce contains non-alphanumeric characters', () => {
      const result = validateMessage({ ...VALID_FIELDS, nonce: 'abc-def-xyz!' });
      expect(result.valid).toBe(false);
      expect(result.errors.some((e) => e.includes('nonce'))).toBe(true);
    });

    it('accepts an 8+ character alphanumeric nonce', () => {
      const result = validateMessage({ ...VALID_FIELDS, nonce: 'abcd1234', expirationTime: undefined });
      expect(result.valid).toBe(true);
    });
  });

  describe('issuedAt validation', () => {
    it('fails when issuedAt is not ISO 8601', () => {
      const result = validateMessage({ ...VALID_FIELDS, issuedAt: '2026/08/06 08:00:00' });
      expect(result.valid).toBe(false);
      expect(result.errors.some((e) => e.includes('issuedAt'))).toBe(true);
    });

    it('fails when issuedAt is an invalid date string', () => {
      const result = validateMessage({ ...VALID_FIELDS, issuedAt: 'not-a-date' });
      expect(result.valid).toBe(false);
      expect(result.errors.some((e) => e.includes('issuedAt'))).toBe(true);
    });
  });

  describe('expirationTime validation', () => {
    it('fails when expirationTime is in the past', () => {
      const result = validateMessage({
        ...VALID_FIELDS,
        expirationTime: '2020-01-01T00:00:00.000Z',
      });
      expect(result.valid).toBe(false);
      expect(result.errors.some((e) => e.toLowerCase().includes('expir'))).toBe(true);
    });

    it('fails when expirationTime format is invalid', () => {
      const result = validateMessage({ ...VALID_FIELDS, expirationTime: '08-06-2026' });
      expect(result.valid).toBe(false);
      expect(result.errors.some((e) => e.includes('expirationTime'))).toBe(true);
    });

    it('accepts a valid future expirationTime', () => {
      const result = validateMessage({
        ...VALID_FIELDS,
        expirationTime: '2099-12-31T23:59:59.999Z',
      });
      expect(result.valid).toBe(true);
    });

    it('accepts a message without expirationTime', () => {
      const rest = { ...VALID_FIELDS, expirationTime: undefined };
      const result = validateMessage(rest);
      expect(result.valid).toBe(true);
    });
  });

  describe('statement validation', () => {
    it('fails when statement contains a newline character', () => {
      const result = validateMessage({ ...VALID_FIELDS, statement: 'Line 1\nLine 2' });
      expect(result.valid).toBe(false);
      expect(result.errors.some((e) => e.includes('statement'))).toBe(true);
    });
  });

  describe('collects multiple errors simultaneously', () => {
    it('returns all errors when multiple fields are invalid', () => {
      const result = validateMessage({
        ...VALID_FIELDS,
        domain: '',
        nonce: 'short',
        uri: 'ftp://invalid',
      });
      expect(result.valid).toBe(false);
      expect(result.errors.length).toBeGreaterThanOrEqual(3);
    });
  });
});

describe('generateNonce()', () => {
  it('returns a 32-character string', () => {
    const nonce = generateNonce();
    expect(nonce).toHaveLength(32);
  });

  it('returns a hexadecimal string', () => {
    const nonce = generateNonce();
    expect(/^[0-9a-f]+$/.test(nonce)).toBe(true);
  });

  it('produces unique values on each call', () => {
    const nonces = new Set(Array.from({ length: 20 }, () => generateNonce()));
    expect(nonces.size).toBe(20);
  });

  it('is valid as a message nonce (length >= 8)', () => {
    const nonce = generateNonce();
    // The nonce generated should pass our own nonce validator
    const result = validateMessage({
      ...VALID_FIELDS,
      nonce,
      expirationTime: undefined,
    });
    expect(result.valid).toBe(true);
  });

  describe('policy enforcement', () => {
    it('validates expectedDomain string and array', () => {
      const valid = validateMessage(VALID_FIELDS, {
        policy: { expectedDomain: 'app.tuwa.io' },
      });
      expect(valid.valid).toBe(true);

      const invalid = validateMessage(VALID_FIELDS, {
        policy: { expectedDomain: 'other.domain.com' },
      });
      expect(invalid.valid).toBe(false);
      expect(invalid.errors.some((e) => e.includes('Domain mismatch'))).toBe(true);

      const validArray = validateMessage(VALID_FIELDS, {
        policy: { expectedDomain: ['auth.tuwa.io', 'app.tuwa.io'] },
      });
      expect(validArray.valid).toBe(true);
    });

    it('validates expectedUri', () => {
      const valid = validateMessage(VALID_FIELDS, {
        policy: { expectedUri: 'https://app.tuwa.io' },
      });
      expect(valid.valid).toBe(true);

      const invalid = validateMessage(VALID_FIELDS, {
        policy: { expectedUri: 'https://other.tuwa.io' },
      });
      expect(invalid.valid).toBe(false);
      expect(invalid.errors.some((e) => e.includes('URI mismatch'))).toBe(true);
    });

    it('validates allowedChainIds', () => {
      const valid = validateMessage(VALID_FIELDS, {
        policy: { allowedChainIds: ['eip155:1', 'solana:mainnet'] },
      });
      expect(valid.valid).toBe(true);

      const invalid = validateMessage(VALID_FIELDS, {
        policy: { allowedChainIds: ['eip155:137', 'solana:mainnet'] },
      });
      expect(invalid.valid).toBe(false);
      expect(invalid.errors.some((e) => e.includes('Chain ID "eip155:1" is not allowed'))).toBe(true);
    });

    it('enforces requireExpirationTime', () => {
      const withoutExp = { ...VALID_FIELDS, expirationTime: undefined };
      const res = validateMessage(withoutExp, {
        policy: { requireExpirationTime: true },
      });
      expect(res.valid).toBe(false);
      expect(res.errors.some((e) => e.includes('expirationTime is required'))).toBe(true);
    });

    it('enforces maxIssuedAtAgeSeconds', () => {
      const staleFields = {
        ...VALID_FIELDS,
        issuedAt: new Date(Date.now() - 600 * 1000).toISOString(),
      };
      const res = validateMessage(staleFields, {
        policy: { maxIssuedAtAgeSeconds: 300, clockSkewSeconds: 0 },
      });
      expect(res.valid).toBe(false);
      expect(res.errors.some((e) => e.includes('older than the allowed max age'))).toBe(true);
    });

    it('enforces maxSessionLifetimeSeconds', () => {
      const longSessionFields = {
        ...VALID_FIELDS,
        issuedAt: '2026-08-06T08:00:00.000Z',
        expirationTime: '2026-08-06T09:00:00.000Z', // 3600 seconds
      };
      const res = validateMessage(longSessionFields, {
        policy: { maxSessionLifetimeSeconds: 1800 },
      });
      expect(res.valid).toBe(false);
      expect(res.errors.some((e) => e.includes('exceeds maximum allowed lifetime'))).toBe(true);
    });
  });
});
