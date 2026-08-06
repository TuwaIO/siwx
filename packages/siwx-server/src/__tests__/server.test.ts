import { buildMessage, generateNonce } from '@tuwaio/siwx-core';
import { generatePrivateKey, privateKeyToAccount } from 'viem/accounts';
import { describe, expect, it } from 'vitest';

import { deserializeCookieSession, generateServerNonce, serializeCookieSession, verifySiwxPayload } from '../server';
import type { SiwxSession } from '../types';

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

  it('rejects verification if signature is invalid or tampered', async () => {
    const { message } = await createEvmPayload();

    const result = await verifySiwxPayload({
      message,
      signature: '0x' + '00'.repeat(65),
    });

    expect(result.success).toBe(false);
  });
});

describe('serializeCookieSession() and deserializeCookieSession()', () => {
  const sampleSession: SiwxSession = {
    address: 'eip155:1:0xAb5801a7D398351b8bE11C439e05C5B3259aeC9B',
    chainId: 'eip155:1',
    domain: 'app.tuwa.io',
    nonce: 'a4f3b2c1d0e5f678',
    issuedAt: '2026-08-06T08:00:00.000Z',
  };

  it('serializes a session into a compliant Set-Cookie header string', () => {
    const { cookieHeader, cookieValue } = serializeCookieSession(sampleSession, {
      name: 'siwx-session',
      maxAge: 3600,
      secure: true,
      sameSite: 'Strict',
    });

    expect(cookieHeader).toContain('siwx-session=');
    expect(cookieHeader).toContain('Max-Age=3600');
    expect(cookieHeader).toContain('HttpOnly');
    expect(cookieHeader).toContain('Secure');
    expect(cookieHeader).toContain('SameSite=Strict');
    expect(cookieValue).toBeTruthy();
  });

  it('deserializes a valid cookie value back to the original SiwxSession', () => {
    const { cookieValue } = serializeCookieSession(sampleSession);

    const deserialized = deserializeCookieSession(cookieValue);

    expect(deserialized).not.toBeNull();
    expect(deserialized?.address).toBe(sampleSession.address);
    expect(deserialized?.chainId).toBe(sampleSession.chainId);
    expect(deserialized?.domain).toBe(sampleSession.domain);
    expect(deserialized?.nonce).toBe(sampleSession.nonce);
  });

  it('returns null when deserializing an invalid cookie string', () => {
    const deserialized = deserializeCookieSession('invalid-base64!!!');
    expect(deserialized).toBeNull();
  });
});

describe('generateServerNonce()', () => {
  it('generates a 32-character hex nonce', () => {
    const nonce = generateServerNonce();
    expect(nonce).toHaveLength(32);
    expect(/^[0-9a-f]+$/.test(nonce)).toBe(true);
  });
});
