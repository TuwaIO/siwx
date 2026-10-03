import { describe, expect, it } from 'vitest';

import { isSessionMatchingTarget } from './validateMessage';

const DEVNET = 'solana:EtWTRABZaYq6iMfeYKouRu166VU2xqa1';
const SOLANA_ACCOUNT = '4sGjMW1sUnHzSxGspuhpqLDx6wiyjNtZAMdL4VZHirAn';

describe('isSessionMatchingTarget', () => {
  it('matches an EVM session by address, case-insensitively, and by chain', () => {
    const session = { address: 'eip155:1:0xAb5801a7D398351b8bE11C439e05C5B3259aeC9B', chainId: 'eip155:1' };

    expect(isSessionMatchingTarget(session, '0xab5801a7d398351b8be11c439e05c5b3259aec9b', 1)).toBe(true);
    expect(isSessionMatchingTarget(session, '0xAb5801a7D398351b8bE11C439e05C5B3259aeC9B', 'eip155:10')).toBe(false);
  });

  it('matches a session signed for a Solana cluster name against its genesis-hash chain ID', () => {
    const session = { address: `solana:devnet:${SOLANA_ACCOUNT}`, chainId: 'solana:devnet' };

    expect(isSessionMatchingTarget(session, SOLANA_ACCOUNT, DEVNET)).toBe(true);
  });

  it('matches a genesis-hash Solana session against a cluster name', () => {
    const session = { address: `${DEVNET}:${SOLANA_ACCOUNT}`, chainId: DEVNET };

    expect(isSessionMatchingTarget(session, SOLANA_ACCOUNT, 'devnet')).toBe(true);
    expect(isSessionMatchingTarget(session, SOLANA_ACCOUNT, 'solana:testnet')).toBe(false);
  });
});
