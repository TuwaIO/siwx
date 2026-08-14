import { describe, expect, it } from 'vitest';

import { getSatelliteSiwxFields } from '../satelliteHelpers';

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
    expect(fields.address).toBe('solana:mainnet:4sGjM');
    expect(fields.chainId).toBe('solana:mainnet');
    expect(fields.uri).toBe('https://test.com');
    expect(fields.expirationTime).toBeDefined();
  });

  it('should throw if missing address or chainId', () => {
    const badConnection = { isConnected: true };
    expect(() => getSatelliteSiwxFields(badConnection as any)).toThrow(
      '[SIWX-REACT] Connection missing address or chainId.',
    );
  });
});
