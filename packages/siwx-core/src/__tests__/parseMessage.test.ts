import { describe, expect, it } from 'vitest';

import { buildMessage } from '../buildMessage';
import { SiwxParseError } from '../errors';
import { parseMessage } from '../parseMessage';
import type { SiwxMessageFields } from '../types';

/** The canonical "full" message string for round-trip testing. */
const FULL_FIELDS: SiwxMessageFields = {
  domain: 'app.tuwa.io',
  address: 'eip155:1:0xAb5801a7D398351b8bE11C439e05C5B3259aeC9B',
  statement: 'Sign in to TUWA.',
  uri: 'https://app.tuwa.io',
  version: '1',
  chainId: 'eip155:1',
  nonce: 'abc12345',
  issuedAt: '2026-08-06T08:00:00.000Z',
  expirationTime: '2026-08-07T08:00:00.000Z',
  notBefore: '2026-08-06T07:00:00.000Z',
  requestId: 'req-abc-123',
  resources: ['https://app.tuwa.io/api', 'https://app.tuwa.io/dashboard'],
};

const MINIMAL_FIELDS: SiwxMessageFields = {
  domain: 'app.tuwa.io',
  address: 'eip155:1:0xAb5801a7D398351b8bE11C439e05C5B3259aeC9B',
  uri: 'https://app.tuwa.io',
  version: '1',
  chainId: 'eip155:1',
  nonce: 'abc12345',
  issuedAt: '2026-08-06T08:00:00.000Z',
};

describe('parseMessage()', () => {
  describe('round-trip compatibility with buildMessage()', () => {
    it('correctly parses a full message built by buildMessage()', () => {
      const raw = buildMessage(FULL_FIELDS);
      const parsed = parseMessage(raw);

      expect(parsed.domain).toBe(FULL_FIELDS.domain);
      expect(parsed.address).toBe(FULL_FIELDS.address);
      expect(parsed.statement).toBe(FULL_FIELDS.statement);
      expect(parsed.uri).toBe(FULL_FIELDS.uri);
      expect(parsed.version).toBe(FULL_FIELDS.version);
      expect(parsed.chainId).toBe(FULL_FIELDS.chainId);
      expect(parsed.nonce).toBe(FULL_FIELDS.nonce);
      expect(parsed.issuedAt).toBe(FULL_FIELDS.issuedAt);
      expect(parsed.expirationTime).toBe(FULL_FIELDS.expirationTime);
      expect(parsed.notBefore).toBe(FULL_FIELDS.notBefore);
      expect(parsed.requestId).toBe(FULL_FIELDS.requestId);
      expect(parsed.resources).toEqual(FULL_FIELDS.resources);
    });

    it('correctly parses a minimal message built by buildMessage()', () => {
      const raw = buildMessage(MINIMAL_FIELDS);
      const parsed = parseMessage(raw);

      expect(parsed.domain).toBe(MINIMAL_FIELDS.domain);
      expect(parsed.address).toBe(MINIMAL_FIELDS.address);
      expect(parsed.statement).toBeUndefined();
      expect(parsed.expirationTime).toBeUndefined();
      expect(parsed.notBefore).toBeUndefined();
      expect(parsed.requestId).toBeUndefined();
      expect(parsed.resources).toBeUndefined();
    });
  });

  describe('correct field extraction', () => {
    it('correctly extracts all labeled fields', () => {
      const raw = buildMessage(FULL_FIELDS);
      const parsed = parseMessage(raw);

      expect(parsed.nonce).toBe('abc12345');
      expect(parsed.chainId).toBe('eip155:1');
      expect(parsed.version).toBe('1');
    });

    it('correctly extracts resources as an array', () => {
      const raw = buildMessage(FULL_FIELDS);
      const parsed = parseMessage(raw);

      expect(parsed.resources).toHaveLength(2);
      expect(parsed.resources).toContain('https://app.tuwa.io/api');
      expect(parsed.resources).toContain('https://app.tuwa.io/dashboard');
    });

    it('returns undefined for resources when message has none', () => {
      const raw = buildMessage(MINIMAL_FIELDS);
      const parsed = parseMessage(raw);
      expect(parsed.resources).toBeUndefined();
    });
  });

  describe('error handling', () => {
    it('throws SiwxParseError for an empty string', () => {
      expect(() => parseMessage('')).toThrowError(SiwxParseError);
    });

    it('throws SiwxParseError when the header line is invalid', () => {
      const badMessage =
        'Invalid header\n0xAddress\n\nURI: https://example.com\nVersion: 1\nChain ID: eip155:1\nNonce: abc12345\nIssued At: 2026-08-06T08:00:00.000Z';
      expect(() => parseMessage(badMessage)).toThrowError(SiwxParseError);
    });

    it('throws SiwxParseError when URI field is missing', () => {
      // Build a valid message then remove the URI line
      const raw = buildMessage(MINIMAL_FIELDS).replace('URI: https://app.tuwa.io\n', '');
      expect(() => parseMessage(raw)).toThrowError(SiwxParseError);
    });

    it('throws SiwxParseError when Nonce field is missing', () => {
      const raw = buildMessage(MINIMAL_FIELDS).replace(/Nonce: .*\n/, '');
      expect(() => parseMessage(raw)).toThrowError(SiwxParseError);
    });

    it('throws SiwxParseError when the message is too short', () => {
      expect(() => parseMessage('too\nshort')).toThrowError(SiwxParseError);
    });

    it('throws SiwxParseError when address line is missing', () => {
      // Simulate a message that starts with the header but has no address
      const bad = 'app.tuwa.io wants you to sign in with your blockchain account:\n';
      expect(() => parseMessage(bad)).toThrowError(SiwxParseError);
    });
  });
});
