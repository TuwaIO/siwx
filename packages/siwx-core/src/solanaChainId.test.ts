import { describe, expect, it } from 'vitest';

import { isChainIdAllowed, normalizeSolanaChainId } from './solanaChainId';

const MAINNET = 'solana:5eykt4UsFv8P8NJdTREpY1vzqKqZKvdp';
const DEVNET = 'solana:EtWTRABZaYq6iMfeYKouRu166VU2xqa1';
const TESTNET = 'solana:4uhcVJyU9pJkvQyS88uRDiswHXSCkY3z';

describe('normalizeSolanaChainId', () => {
  it('turns cluster names into the genesis-hash chain ID of CAIP-30', () => {
    expect(normalizeSolanaChainId('solana:mainnet')).toBe(MAINNET);
    expect(normalizeSolanaChainId('solana:mainnet-beta')).toBe(MAINNET);
    expect(normalizeSolanaChainId('solana:devnet')).toBe(DEVNET);
    expect(normalizeSolanaChainId('solana:testnet')).toBe(TESTNET);
  });

  it('maps the testnet ID from before the genesis reset to the current one', () => {
    expect(normalizeSolanaChainId('solana:4uhcVJyU9pJkvQyS88uRfhDSfZSm8DoR')).toBe(TESTNET);
  });

  it('keeps genesis-hash IDs, other Solana IDs and other namespaces unchanged', () => {
    expect(normalizeSolanaChainId(DEVNET)).toBe(DEVNET);
    expect(normalizeSolanaChainId('solana:localnet')).toBe('solana:localnet');
    expect(normalizeSolanaChainId('eip155:1')).toBe('eip155:1');
    expect(normalizeSolanaChainId('devnet')).toBe('devnet');
  });
});

describe('isChainIdAllowed', () => {
  it('allows every chain when the list is missing or empty', () => {
    expect(isChainIdAllowed('eip155:1')).toBe(true);
    expect(isChainIdAllowed('eip155:1', [])).toBe(true);
  });

  it('matches a Solana cluster under its name and its genesis-hash ID', () => {
    expect(isChainIdAllowed(DEVNET, ['solana:devnet'])).toBe(true);
    expect(isChainIdAllowed('solana:devnet', [DEVNET])).toBe(true);
    expect(isChainIdAllowed(TESTNET, ['solana:devnet'])).toBe(false);
  });

  it('matches other chain IDs exactly', () => {
    expect(isChainIdAllowed('eip155:1', ['eip155:1'])).toBe(true);
    expect(isChainIdAllowed('eip155:1', ['1'])).toBe(false);
    expect(isChainIdAllowed('eip155:1', ['solana:1'])).toBe(false);
  });
});
