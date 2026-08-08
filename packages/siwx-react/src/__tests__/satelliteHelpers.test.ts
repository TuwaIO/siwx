import { describe, expect, it } from 'vitest';

import { getSatelliteSiwxFields } from '../satelliteHelpers';

describe('getSatelliteSiwxFields', () => {
  it('should generate fields for EVM connection', () => {
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
  });

  it('should throw if missing address or chainId', () => {
    const badConnection = { isConnected: true };
    expect(() => getSatelliteSiwxFields(badConnection as any)).toThrow(
      '[SIWX-REACT] Connection missing address or chainId.',
    );
  });
});
