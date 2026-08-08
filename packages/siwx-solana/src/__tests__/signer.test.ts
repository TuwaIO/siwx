import { describe, expect, it, vi } from 'vitest';

import { createSolanaSiwxSigner } from '../signer';

describe('createSolanaSiwxSigner', () => {
  it('should handle Web3 v2 (modifyAndSignMessages)', async () => {
    const mockSigner = {
      address: 'mock_address',
      modifyAndSignMessages: vi.fn().mockResolvedValue([
        {
          signatures: { mock_address: new Uint8Array([1, 2, 3]) },
        },
      ]),
    };

    const signer = createSolanaSiwxSigner(mockSigner as any);
    const signature = await signer('test message');

    expect(typeof signature).toBe('string');
    expect(mockSigner.modifyAndSignMessages).toHaveBeenCalled();
  });

  it('should handle Wallet Standard (signMessages)', async () => {
    const mockSigner = {
      signMessages: vi.fn().mockResolvedValue([
        {
          signature: new Uint8Array([4, 5, 6]),
        },
      ]),
    };

    const signer = createSolanaSiwxSigner(mockSigner as any);
    const signature = await signer('test msg');

    expect(typeof signature).toBe('string');
    expect(mockSigner.signMessages).toHaveBeenCalled();
  });

  it('should handle Legacy (signMessage)', async () => {
    const mockSigner = {
      signMessage: vi.fn().mockResolvedValue(new Uint8Array([7, 8, 9])),
    };

    const signer = createSolanaSiwxSigner(mockSigner as any);
    const signature = await signer('legacy');

    expect(typeof signature).toBe('string');
    expect(mockSigner.signMessage).toHaveBeenCalled();
  });

  it('should throw if no signing capability', async () => {
    const mockSigner = {};
    const signer = createSolanaSiwxSigner(mockSigner as any);
    await expect(signer('test')).rejects.toThrow('[SIWX-SOLANA] Signer lacks known message signing capabilities.');
  });
});
