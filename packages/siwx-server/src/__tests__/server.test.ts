import { buildMessage, generateNonce } from '@tuwaio/siwx-core';
import { generatePrivateKey, privateKeyToAccount } from 'viem/accounts';
import { describe, expect, it } from 'vitest';

import {
  createClearCookie,
  createSessionCookie,
  generateServerNonce,
  MemorySiwxNonceStore,
  MemorySiwxSessionStore,
  parseCookie,
  signStatelessDemoSession,
  verifySiwxPayload,
  verifyStatelessDemoSession,
} from '../server';
import type { SiwxSession } from '../types';

const TEST_SECRET = '0123456789abcdef0123456789abcdef'; // 32 characters

/** Helper to generate a valid signed EVM payload. */
async function createEvmPayload(overrides: Partial<Parameters<typeof buildMessage>[0]> = {}) {
  const privateKey = generatePrivateKey();
  const account = privateKeyToAccount(privateKey);
  const nonce = generateNonce();

  const message = buildMessage({
    domain: 'app.tuwa.io',
    address: `eip155:1:${account.address}`,
    uri: 'https://app.tuwa.io',
    version: '1',
    chainId: 'eip155:1',
    nonce,
    issuedAt: new Date().toISOString(),
    ...overrides,
  });

  const signature = await account.signMessage({ message });
  return { message, signature, account, nonce };
}

describe('verifySiwxPayload()', () => {
  it('successfully verifies a valid EVM payload and returns session data', async () => {
    const { message, signature, account } = await createEvmPayload();

    const result = await verifySiwxPayload({ message, signature });

    expect(result.success).toBe(true);
    expect(result.namespace).toBe('eip155');
    expect(result.data?.address).toBe(`eip155:1:${account.address}`);
    expect(result.data?.domain).toBe('app.tuwa.io');
  });

  it('rejects verification if nonce is present in usedNonces set (replay protection)', async () => {
    const { message, signature, nonce } = await createEvmPayload();

    const usedNonces = new Set<string>([nonce]);

    const result = await verifySiwxPayload({ message, signature }, { usedNonces });

    expect(result.success).toBe(false);
    expect(result.error).toContain('Nonce has already been used');
  });

  it('rejects verification if message has expired', async () => {
    const { message, signature } = await createEvmPayload({
      expirationTime: '2020-01-01T00:00:00.000Z',
    });

    const result = await verifySiwxPayload({ message, signature });

    expect(result.success).toBe(false);
    expect(result.error).toContain('expired');
  });

  it('allows expired message if skipExpiration: true is specified', async () => {
    const { message, signature } = await createEvmPayload({
      expirationTime: '2020-01-01T00:00:00.000Z',
    });

    const result = await verifySiwxPayload({ message, signature }, { skipExpiration: true });

    expect(result.success).toBe(true);
  });

  it('enforces verification policy on payload', async () => {
    const { message, signature } = await createEvmPayload();

    const validResult = await verifySiwxPayload({ message, signature }, { policy: { expectedDomain: 'app.tuwa.io' } });
    expect(validResult.success).toBe(true);

    const invalidResult = await verifySiwxPayload(
      { message, signature },
      { policy: { expectedDomain: 'different.io' } },
    );
    expect(invalidResult.success).toBe(false);
    expect(invalidResult.error).toContain('Domain mismatch');
  });

  it('rejects verification if signature is invalid or tampered', async () => {
    const { message } = await createEvmPayload();

    const result = await verifySiwxPayload({
      message,
      signature: '0x' + '00'.repeat(65),
    });

    expect(result.success).toBe(false);
  });
});

describe('signStatelessDemoSession() and verifyStatelessDemoSession()', () => {
  const sampleSession: SiwxSession = {
    address: 'eip155:1:0xAb5801a7D398351b8bE11C439e05C5B3259aeC9B',
    chainId: 'eip155:1',
    domain: 'app.tuwa.io',
    nonce: 'a4f3b2c1d0e5f678',
    issuedAt: new Date().toISOString(),
    expirationTime: new Date(Date.now() + 1800 * 1000).toISOString(),
  };

  it('signs and verifies a valid stateless demo token', async () => {
    const token = await signStatelessDemoSession(sampleSession, TEST_SECRET);
    expect(token).toContain('.');

    const verified = await verifyStatelessDemoSession(token, TEST_SECRET);
    expect(verified).not.toBeNull();
    expect(verified?.address).toBe(sampleSession.address);
    expect(verified?.domain).toBe(sampleSession.domain);
    expect(verified?.chainId).toBe(sampleSession.chainId);
  });

  it('rejects token signed with a different secret', async () => {
    const token = await signStatelessDemoSession(sampleSession, TEST_SECRET);
    const otherSecret = 'fedcba9876543210fedcba9876543210';

    const verified = await verifyStatelessDemoSession(token, otherSecret);
    expect(verified).toBeNull();
  });

  it('rejects tampered token payload or signature', async () => {
    const token = await signStatelessDemoSession(sampleSession, TEST_SECRET);
    const [payload, sig] = token.split('.');
    const tamperedToken = `${payload}x.${sig}`;

    const verified = await verifyStatelessDemoSession(tamperedToken, TEST_SECRET);
    expect(verified).toBeNull();
  });

  it('rejects expired demo token', async () => {
    const expiredSession: SiwxSession = {
      ...sampleSession,
      expirationTime: new Date(Date.now() - 5000).toISOString(),
    };

    const token = await signStatelessDemoSession(expiredSession, TEST_SECRET, 1);
    const verified = await verifyStatelessDemoSession(token, TEST_SECRET, { clockSkewSeconds: 0 });
    expect(verified).toBeNull();
  });

  it('rejects short secret (< 32 characters)', async () => {
    await expect(signStatelessDemoSession(sampleSession, 'too-short-secret')).rejects.toThrow('at least 32 characters');
  });
});

describe('MemorySiwxSessionStore and MemorySiwxNonceStore', () => {
  it('handles session lifecycle in MemorySiwxSessionStore', async () => {
    const store = new MemorySiwxSessionStore();
    const session: SiwxSession = {
      address: 'eip155:1:0x123',
      chainId: 'eip155:1',
      domain: 'tuwa.io',
      nonce: '12345678',
      issuedAt: new Date().toISOString(),
    };

    const record = await store.create({ session, ttlSeconds: 300 });
    expect(record.id).toBeTruthy();

    const fetched = await store.get(record.id);
    expect(fetched?.session.address).toBe('eip155:1:0x123');

    const bound = await store.bindSubject(record.id, 'user_999');
    expect(bound).toBe(true);

    const fetchedBound = await store.get(record.id);
    expect(fetchedBound?.subjectId).toBe('user_999');

    await store.revoke(record.id);
    const deleted = await store.get(record.id);
    expect(deleted).toBeNull();
  });

  it('handles single-use nonce consumption in MemorySiwxNonceStore', async () => {
    const store = new MemorySiwxNonceStore();
    const nonce = 'nonce_abc12345';

    await store.issue({ nonce, ttlSeconds: 60 });

    const firstConsume = await store.consume({ nonce });
    expect(firstConsume).toBe(true);

    // Replay attempt must return false
    const replayConsume = await store.consume({ nonce });
    expect(replayConsume).toBe(false);
  });
});

describe('Cookie helpers', () => {
  it('creates secure session cookie and parses it', () => {
    const header = createSessionCookie('test_session_id', {
      name: 'siwx-session-v2',
      maxAge: 3600,
    });

    expect(header).toContain('siwx-session-v2=test_session_id');
    expect(header).toContain('HttpOnly');
    expect(header).toContain('SameSite=Strict');

    const parsed = parseCookie(`foo=bar; siwx-session-v2=test_session_id; baz=1`, 'siwx-session-v2');
    expect(parsed).toBe('test_session_id');
  });

  it('creates clear cookie', () => {
    const clearHeader = createClearCookie({ name: 'siwx-session-v2' });
    expect(clearHeader).toContain('siwx-session-v2=');
    expect(clearHeader).toContain('Max-Age=0');
  });
});

describe('generateServerNonce()', () => {
  it('generates a 32-character hex nonce', () => {
    const nonce = generateServerNonce();
    expect(nonce).toHaveLength(32);
    expect(/^[0-9a-f]+$/.test(nonce)).toBe(true);
  });
});
