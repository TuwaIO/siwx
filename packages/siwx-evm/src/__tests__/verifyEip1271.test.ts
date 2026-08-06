import { buildMessage } from '@tuwaio/siwx-core';
import type { PublicClient } from 'viem';
import { describe, expect, it, vi } from 'vitest';

import { verifyEip1271 } from '../verify';

const SMART_CONTRACT_ADDRESS = '0x1111111111111111111111111111111111111111';

describe('verifyEip1271()', () => {
  it('successfully verifies smart contract signature when readContract returns magic value 0x1626ba7e', async () => {
    const mockPublicClient = {
      readContract: vi.fn().mockResolvedValue('0x1626ba7e'),
    } as unknown as PublicClient;

    const message = buildMessage({
      domain: 'app.tuwa.io',
      address: `eip155:1:${SMART_CONTRACT_ADDRESS}`,
      uri: 'https://app.tuwa.io',
      version: '1',
      chainId: 'eip155:1',
      nonce: 'a4f3b2c1d0e5f678',
      issuedAt: '2026-08-06T08:00:00.000Z',
    });

    const result = await verifyEip1271(message, '0x123456', { publicClient: mockPublicClient });

    expect(result.success).toBe(true);
    expect(result.method).toBe('eip1271');
    expect(result.data?.address).toBe(`eip155:1:${SMART_CONTRACT_ADDRESS}`);
    expect(mockPublicClient.readContract).toHaveBeenCalledTimes(1);
  });

  it('fails verification when readContract returns invalid magic value', async () => {
    const mockPublicClient = {
      readContract: vi.fn().mockResolvedValue('0xffffffff'),
    } as unknown as PublicClient;

    const message = buildMessage({
      domain: 'app.tuwa.io',
      address: `eip155:1:${SMART_CONTRACT_ADDRESS}`,
      uri: 'https://app.tuwa.io',
      version: '1',
      chainId: 'eip155:1',
      nonce: 'a4f3b2c1d0e5f678',
      issuedAt: '2026-08-06T08:00:00.000Z',
    });

    const result = await verifyEip1271(message, '0x123456', { publicClient: mockPublicClient });

    expect(result.success).toBe(false);
    expect(result.error).toContain('EIP-1271: isValidSignature returned invalid magic value');
  });

  it('fails verification when publicClient is omitted', async () => {
    const message = buildMessage({
      domain: 'app.tuwa.io',
      address: `eip155:1:${SMART_CONTRACT_ADDRESS}`,
      uri: 'https://app.tuwa.io',
      version: '1',
      chainId: 'eip155:1',
      nonce: 'a4f3b2c1d0e5f678',
      issuedAt: '2026-08-06T08:00:00.000Z',
    });

    const result = await verifyEip1271(message, '0x123456', {});

    expect(result.success).toBe(false);
    expect(result.error).toContain('EIP-1271 verification requires a publicClient');
  });
});
