import { describe, expect, it } from 'vitest';

import { getSatelliteSiwxFields, isSessionMatchingConnection } from './satelliteHelpers';

describe('getSatelliteSiwxFields', () => {
  it('should generate fields for EVM connection with default expirationTime', () => {
    const activeConnection = {
      address: '0x123abc',
      chainId: 1,
      isConnected: true,
      connector: {},
    };

    const fields = getSatelliteSiwxFields(activeConnection, { domain: 'example.com' });
    expect(fields.address).toBe('eip155:1:0x123abc');
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
    const activeConnection = { address: 'abc', chainId: '137', connector };

    const fields = getSatelliteSiwxFields(activeConnection);
    expect(fields.chainId).toBe('eip155:137');
    expect(fields.address).toBe('eip155:137:abc');
  });

  it('should support custom expirationSeconds', () => {
    const activeConnection = {
      address: '0x123abc',
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
      address: '4sGjM',
      chainId: 'mainnet',
      isConnected: true,
      connectedAccount: {},
    };

    const fields = getSatelliteSiwxFields(activeConnection, { uri: 'https://test.com' });
    expect(fields.address).toBe('solana:5eykt4UsFv8P8NJdTREpY1vzqKqZKvdp:4sGjM');
    expect(fields.chainId).toBe('solana:5eykt4UsFv8P8NJdTREpY1vzqKqZKvdp');
    expect(fields.uri).toBe('https://test.com');
    expect(fields.expirationTime).toBeDefined();
  });

  it('should use the genesis-hash chain ID for a Solana connection given as a cluster or a Wallet Standard chain', () => {
    const devnet = 'solana:EtWTRABZaYq6iMfeYKouRu166VU2xqa1';

    expect(getSatelliteSiwxFields({ address: '4sGjM', chainId: 'devnet' }).chainId).toBe(devnet);
    expect(getSatelliteSiwxFields({ address: '4sGjM', chainId: 'solana:devnet' }).chainId).toBe(devnet);
    expect(getSatelliteSiwxFields({ address: '4sGjM', chainId: devnet }).chainId).toBe(devnet);
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

  it('matches a Solana session signed with a cluster name to the same cluster', () => {
    const oldSession = { ...session, address: 'solana:devnet:4sGjM', chainId: 'solana:devnet' };

    expect(isSessionMatchingConnection(oldSession, { address: '4sGjM', chainId: 'devnet' })).toBe(true);
    expect(isSessionMatchingConnection(oldSession, { address: '4sGjM', chainId: 'testnet' })).toBe(false);
  });

  it('matches a genesis-hash Solana session to its cluster', () => {
    const devnet = 'solana:EtWTRABZaYq6iMfeYKouRu166VU2xqa1';
    const newSession = { ...session, address: `${devnet}:4sGjM`, chainId: devnet };

    expect(isSessionMatchingConnection(newSession, { address: '4sGjM', chainId: 'devnet' })).toBe(true);
    expect(isSessionMatchingConnection(newSession, { address: 'otherAccount', chainId: 'devnet' })).toBe(false);
  });
});
