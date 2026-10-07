import { describe, expect, it } from 'vitest';

import { getSatelliteSiwxFields, isSessionMatchingConnection } from './satelliteHelpers';

const EVM_ACCOUNT = '0xAb5801a7D398351b8bE11C439e05C5B3259aeC9B';
const SOLANA_ACCOUNT = '4sGjMW1sUnHzSxGspuhpqLDx6wiyjNtZAMdL4VZHirAn';
const OTHER_SOLANA_ACCOUNT = 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v';

describe('getSatelliteSiwxFields', () => {
  it('should generate fields for EVM connection with default expirationTime', () => {
    const activeConnection = {
      address: EVM_ACCOUNT,
      chainId: 1,
      isConnected: true,
      connector: {},
    };

    const fields = getSatelliteSiwxFields(activeConnection, { domain: 'example.com' });
    expect(fields.address).toBe(`eip155:1:${EVM_ACCOUNT}`);
    expect(fields.chainId).toBe('eip155:1');
    expect(fields.domain).toBe('example.com');
    expect(fields.expirationTime).toBeDefined();
    expect(new Date(fields.expirationTime!).getTime()).toBeGreaterThan(Date.now());
  });

  it('should accept a wagmi-shaped connector and treat the connection as EVM', () => {
    // A typed connector without the optional fields of an inline literal, like the wagmi `Connector` of a
    // Satellite `EVMConnection`: it must type-check and its presence alone marks the connection as EVM
    const connector: { id: string; name: string; type: string } = {
      id: 'injected',
      name: 'Injected',
      type: 'injected',
    };
    const activeConnection = { address: EVM_ACCOUNT, chainId: '137', connector };

    const fields = getSatelliteSiwxFields(activeConnection);
    expect(fields.chainId).toBe('eip155:137');
    expect(fields.address).toBe(`eip155:137:${EVM_ACCOUNT}`);
  });

  it('should support custom expirationSeconds', () => {
    const activeConnection = {
      address: EVM_ACCOUNT,
      chainId: 1,
      isConnected: true,
    };

    const fields = getSatelliteSiwxFields(activeConnection, { expirationSeconds: 600 });
    const expiresAt = new Date(fields.expirationTime!).getTime();
    const expected = Date.now() + 600 * 1000;
    expect(Math.abs(expiresAt - expected)).toBeLessThan(5000);
  });

  it('should generate fields for Solana connection', () => {
    const activeConnection = {
      address: SOLANA_ACCOUNT,
      chainId: 'mainnet',
      isConnected: true,
      connectedAccount: {},
    };

    const fields = getSatelliteSiwxFields(activeConnection, { uri: 'https://test.com' });
    expect(fields.address).toBe(`solana:5eykt4UsFv8P8NJdTREpY1vzqKqZKvdp:${SOLANA_ACCOUNT}`);
    expect(fields.chainId).toBe('solana:5eykt4UsFv8P8NJdTREpY1vzqKqZKvdp');
    expect(fields.uri).toBe('https://test.com');
    expect(fields.expirationTime).toBeDefined();
  });

  it('should use the genesis-hash chain ID for a Solana connection given as a cluster or a Wallet Standard chain', () => {
    const devnet = 'solana:EtWTRABZaYq6iMfeYKouRu166VU2xqa1';

    expect(getSatelliteSiwxFields({ address: SOLANA_ACCOUNT, chainId: 'devnet' }).chainId).toBe(devnet);
    expect(getSatelliteSiwxFields({ address: SOLANA_ACCOUNT, chainId: 'solana:devnet' }).chainId).toBe(devnet);
    expect(getSatelliteSiwxFields({ address: SOLANA_ACCOUNT, chainId: devnet }).chainId).toBe(devnet);
  });

  it('should throw for an address that is not an account of the connection chain', () => {
    expect(() => getSatelliteSiwxFields({ address: '0x123abc', chainId: 1 })).toThrow('[SIWX-REACT]');
    expect(() => getSatelliteSiwxFields({ address: EVM_ACCOUNT, chainId: 'devnet' })).toThrow('[SIWX-REACT]');
  });

  it('should throw if missing address or chainId', () => {
    const badConnection = { isConnected: true };
    expect(() => getSatelliteSiwxFields(badConnection as any)).toThrow(
      '[SIWX-REACT] Connection missing address or chainId.',
    );
  });
});

describe('isSessionMatchingConnection', () => {
  const session = {
    domain: 'app.tuwa.io',
    issuedAt: new Date().toISOString(),
  };

  it('matches an EVM session to the same account on the same chain, ignoring case', () => {
    const evmSession = { ...session, address: `eip155:1:${EVM_ACCOUNT}`, chainId: 'eip155:1' };

    expect(isSessionMatchingConnection(evmSession, { address: EVM_ACCOUNT.toLowerCase(), chainId: 1 })).toBe(true);
    expect(isSessionMatchingConnection(evmSession, { address: EVM_ACCOUNT, chainId: 10 })).toBe(false);
  });

  it('matches a Solana session signed with a cluster name to the same cluster', () => {
    const oldSession = { ...session, address: `solana:devnet:${SOLANA_ACCOUNT}`, chainId: 'solana:devnet' };

    expect(isSessionMatchingConnection(oldSession, { address: SOLANA_ACCOUNT, chainId: 'devnet' })).toBe(true);
    expect(isSessionMatchingConnection(oldSession, { address: SOLANA_ACCOUNT, chainId: 'testnet' })).toBe(false);
  });

  it('matches a genesis-hash Solana session to its cluster', () => {
    const devnet = 'solana:EtWTRABZaYq6iMfeYKouRu166VU2xqa1';
    const newSession = { ...session, address: `${devnet}:${SOLANA_ACCOUNT}`, chainId: devnet };

    expect(isSessionMatchingConnection(newSession, { address: SOLANA_ACCOUNT, chainId: 'devnet' })).toBe(true);
    expect(isSessionMatchingConnection(newSession, { address: OTHER_SOLANA_ACCOUNT, chainId: 'devnet' })).toBe(false);
  });
});
