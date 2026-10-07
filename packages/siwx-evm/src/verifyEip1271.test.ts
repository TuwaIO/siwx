import { buildMessage, type SiwxChainId } from '@tuwaio/siwx-core';
import { createPublicClient, type Hex, http, type PublicClient, serializeErc6492Signature } from 'viem';
import { base, mainnet, zksync } from 'viem/chains';
import { describe, expect, it, vi } from 'vitest';

import type { EvmVerifyClient, EvmVerifyOptions } from './types';
import { verifyEip1271, verifyEvmSignature } from './verify';

const SMART_CONTRACT_ADDRESS = '0x1111111111111111111111111111111111111111';
const FACTORY = '0x2222222222222222222222222222222222222222';
const SIGNATURE = `0x${'ab'.repeat(65)}` as Hex;

function messageOn(chainId: SiwxChainId): string {
  return buildMessage({
    domain: 'app.tuwa.io',
    address: `${chainId}:${SMART_CONTRACT_ADDRESS}`,
    uri: 'https://app.tuwa.io',
    version: '1',
    chainId,
    nonce: 'a4f3b2c1d0e5f678',
    issuedAt: '2026-08-06T08:00:00.000Z',
  });
}

/** A client whose `eth_call` answers what the ERC-6492 universal validator would: `0x01` valid, `0x00` invalid. */
function clientOf(chainId: number | undefined, valid = true) {
  const call = vi.fn(async () => ({ data: (valid ? '0x01' : '0x00') as Hex }));
  return {
    client: { chain: chainId === undefined ? undefined : { id: chainId }, call } as unknown as PublicClient,
    call,
  };
}

describe('verifyEip1271()', () => {
  it('verifies a deployed contract wallet on the chain of the message', async () => {
    const { client, call } = clientOf(1);

    const result = await verifyEip1271(messageOn('eip155:1'), SIGNATURE, { publicClient: client });

    expect(result).toMatchObject({ success: true, method: 'eip1271' });
    expect(result.data?.address).toBe(`eip155:1:${SMART_CONTRACT_ADDRESS}`);
    expect(call).toHaveBeenCalledTimes(1);
    const { data } = (call.mock.calls[0] as unknown as [{ data: Hex }])[0];
    expect(data).toContain(SMART_CONTRACT_ADDRESS.slice(2));
    expect(data).toContain(SIGNATURE.slice(2));
  });

  it('verifies a counterfactual wallet that signed with an ERC-6492 wrapper', async () => {
    const { client } = clientOf(8453);
    const wrapped = serializeErc6492Signature({ address: FACTORY, data: '0xdeadbeef', signature: SIGNATURE });

    const result = await verifyEip1271(messageOn('eip155:8453'), wrapped, { publicClient: client });

    expect(result).toMatchObject({ success: true, method: 'erc6492' });
  });

  it('fails when the wallet rejects the signature', async () => {
    const { client } = clientOf(1, false);

    const result = await verifyEip1271(messageOn('eip155:1'), SIGNATURE, { publicClient: client });

    expect(result.success).toBe(false);
    expect(result.error).toContain('not valid');
  });

  it('asks a client function for the client of the message chain', async () => {
    const base = clientOf(8453);
    const clients = vi.fn((chainId: number) => (chainId === 8453 ? base.client : undefined));

    const onBase = await verifyEip1271(messageOn('eip155:8453'), SIGNATURE, { publicClient: clients });
    const onOptimism = await verifyEip1271(messageOn('eip155:10'), SIGNATURE, { publicClient: clients });

    expect(onBase.success).toBe(true);
    expect(clients).toHaveBeenCalledWith(8453);
    expect(onOptimism.success).toBe(false);
    expect(onOptimism.error).toContain('eip155:10');
    expect(base.call).toHaveBeenCalledTimes(1);
  });

  it('never checks a signature on a client of another chain', async () => {
    const { client, call } = clientOf(1);

    const result = await verifyEip1271(messageOn('eip155:8453'), SIGNATURE, { publicClient: client });

    expect(result.success).toBe(false);
    expect(result.error).toContain('eip155:8453');
    expect(call).not.toHaveBeenCalled();
  });

  it('uses a client without a chain for any chain', async () => {
    const { client } = clientOf(undefined);

    const result = await verifyEip1271(messageOn('eip155:42161'), SIGNATURE, { publicClient: client });

    expect(result.success).toBe(true);
  });

  it('fails verification when publicClient is omitted', async () => {
    const result = await verifyEip1271(messageOn('eip155:1'), SIGNATURE, {});

    expect(result.success).toBe(false);
    expect(result.error).toContain('requires a publicClient');
  });
});

describe('verifyEvmSignature()', () => {
  it('falls back to the contract wallet check with the client of the message chain', async () => {
    const base = clientOf(8453);

    const result = await verifyEvmSignature(messageOn('eip155:8453'), SIGNATURE, {
      publicClient: (chainId) => (chainId === 8453 ? base.client : undefined),
    });

    expect(result).toMatchObject({ success: true, method: 'eip1271' });
  });
});

describe('EvmVerifyOptions', () => {
  it('takes the clients of chains with their own formatters, alone or from a function', () => {
    const clients = new Map<number, EvmVerifyClient>(
      [mainnet, base, zksync].map((chain) => [chain.id, createPublicClient({ chain, transport: http() })]),
    );
    const perChain: EvmVerifyOptions = { publicClient: (chainId) => clients.get(chainId) };
    const single: EvmVerifyOptions = { publicClient: createPublicClient({ chain: base, transport: http() }) };

    expect(typeof perChain.publicClient).toBe('function');
    expect(single.publicClient).toBeDefined();
  });
});
