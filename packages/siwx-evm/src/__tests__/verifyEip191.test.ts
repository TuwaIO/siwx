import { buildMessage } from '@tuwaio/siwx-core';
import { generatePrivateKey, privateKeyToAccount } from 'viem/accounts';
import { describe, expect, it } from 'vitest';

import { verifyEip191 } from '../verify';

describe('verifyEip191()', () => {
  it('successfully verifies a valid EIP-191 signature signed by a real EVM account', async () => {
    const privateKey = generatePrivateKey();
    const account = privateKeyToAccount(privateKey);

    const message = buildMessage({
      domain: 'app.tuwa.io',
      address: `eip155:1:${account.address}`,
      uri: 'https://app.tuwa.io',
      version: '1',
      chainId: 'eip155:1',
      nonce: 'a4f3b2c1d0e5f678',
      issuedAt: '2026-08-06T08:00:00.000Z',
    });

    const signature = await account.signMessage({ message });

    const result = await verifyEip191(message, signature);

    expect(result.success).toBe(true);
    expect(result.data?.address).toBe(`eip155:1:${account.address}`);
    expect(result.method).toBe('eip191');
    expect(result.error).toBeUndefined();
  });

  it('fails verification when signature is signed by a different address', async () => {
    const signerAccount = privateKeyToAccount(generatePrivateKey());
    const victimAccount = privateKeyToAccount(generatePrivateKey());

    const message = buildMessage({
      domain: 'app.tuwa.io',
      address: `eip155:1:${victimAccount.address}`,
      uri: 'https://app.tuwa.io',
      version: '1',
      chainId: 'eip155:1',
      nonce: 'a4f3b2c1d0e5f678',
      issuedAt: '2026-08-06T08:00:00.000Z',
    });

    const signature = await signerAccount.signMessage({ message });

    const result = await verifyEip191(message, signature);

    expect(result.success).toBe(false);
    expect(result.error).toContain('Signature recovery mismatch');
  });

  it('fails verification when message is tampered after signing', async () => {
    const account = privateKeyToAccount(generatePrivateKey());

    const message = buildMessage({
      domain: 'app.tuwa.io',
      address: `eip155:1:${account.address}`,
      uri: 'https://app.tuwa.io',
      version: '1',
      chainId: 'eip155:1',
      nonce: 'a4f3b2c1d0e5f678',
      issuedAt: '2026-08-06T08:00:00.000Z',
    });

    const signature = await account.signMessage({ message });

    const tamperedMessage = message.replace('app.tuwa.io', 'evil.tuwa.io');

    const result = await verifyEip191(tamperedMessage, signature);

    expect(result.success).toBe(false);
  });

  it('fails when chainId is not an EVM chain namespace', async () => {
    const account = privateKeyToAccount(generatePrivateKey());

    const message = buildMessage({
      domain: 'app.tuwa.io',
      address: `solana:5eykt4UsFv8P8NJdTREpY1vzqKqZKvdpK:4sGjMW1sRLRbt4zvMKXQc9oFKhfffJyEBscCNVS1NTLG`,
      uri: 'https://app.tuwa.io',
      version: '1',
      chainId: 'solana:5eykt4UsFv8P8NJdTREpY1vzqKqZKvdpK' as unknown as `eip155:1`,
      nonce: 'a4f3b2c1d0e5f678',
      issuedAt: '2026-08-06T08:00:00.000Z',
    });

    const signature = await account.signMessage({ message });

    const result = await verifyEip191(message, signature);

    expect(result.success).toBe(false);
    expect(result.error).toContain('Unsupported CAIP-2 namespace');
  });
});
