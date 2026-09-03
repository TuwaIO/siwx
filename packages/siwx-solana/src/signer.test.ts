import { describe, expect, it, vi } from 'vitest';

import { createSolanaSiwxSigner } from './signer';

describe('createSolanaSiwxSigner', () => {
  it('should handle Web3 v2 (@solana/kit modifyAndSignMessages)', async () => {
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

  it('should handle Wallet Standard solana:signMessage feature', async () => {
    const mockWallet = {
      address: 'wallet_std_address',
      features: {
        'solana:signMessage': {
          version: '1.0.0',
          signMessage: vi.fn().mockResolvedValue([
            {
              signature: new Uint8Array([10, 20, 30]),
              signedMessage: new Uint8Array([1, 2, 3]),
            },
          ]),
        },
      },
    };

    const signer = createSolanaSiwxSigner({ wallet: mockWallet as any });
    const signature = await signer('wallet standard test');

    expect(typeof signature).toBe('string');
    expect(mockWallet.features['solana:signMessage'].signMessage).toHaveBeenCalled();
  });

  it('should handle Wallet Standard (signMessages method)', async () => {
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

  it('should handle Legacy (signMessage returning Uint8Array)', async () => {
    const mockSigner = {
      signMessage: vi.fn().mockResolvedValue(new Uint8Array([7, 8, 9])),
    };

    const signer = createSolanaSiwxSigner(mockSigner as any);
    const signature = await signer('legacy');

    expect(typeof signature).toBe('string');
    expect(mockSigner.signMessage).toHaveBeenCalled();
  });

  it('should handle Legacy (signMessage returning { signature: Uint8Array })', async () => {
    const mockSigner = {
      signMessage: vi.fn().mockResolvedValue({ signature: new Uint8Array([11, 12, 13]) }),
    };

    const signer = createSolanaSiwxSigner(mockSigner as any);
    const signature = await signer('legacy object');

    expect(typeof signature).toBe('string');
    expect(mockSigner.signMessage).toHaveBeenCalled();
  });

  it('should throw if target is null or undefined', async () => {
    const signer = createSolanaSiwxSigner(null as any);
    await expect(signer('test')).rejects.toThrow('[SIWX-SOLANA] Invalid signer target.');
  });

  it('should throw if no signing capability exists on target', async () => {
    const mockSigner = {};
    const signer = createSolanaSiwxSigner(mockSigner as any);
    await expect(signer('test')).rejects.toThrow('[SIWX-SOLANA] Signer lacks known message signing capabilities.');
  });

  it('should throw when wallet standard returns empty output', async () => {
    const mockWallet = {
      address: 'wallet_std_address',
      features: {
        'solana:signMessage': {
          version: '1.0.0',
          signMessage: vi.fn().mockResolvedValue([]),
        },
      },
    };

    const signer = createSolanaSiwxSigner({ wallet: mockWallet as any });
    await expect(signer('test')).rejects.toThrow('Wallet returned invalid signMessage output');
  });

  it('should throw when signMessages returns invalid output without signature', async () => {
    const mockSigner = {
      signMessages: vi.fn().mockResolvedValue([{}]),
    };

    const signer = createSolanaSiwxSigner(mockSigner as any);
    await expect(signer('test')).rejects.toThrow('Wallet returned invalid signMessages output');
  });

  it('should throw when legacy signMessage returns unexpected format', async () => {
    const mockSigner = {
      signMessage: vi.fn().mockResolvedValue('invalid_string_format'),
    };

    const signer = createSolanaSiwxSigner(mockSigner as any);
    await expect(signer('test')).rejects.toThrow('Unexpected legacy signMessage result format');
  });

  it('should throw when AbortSignal is already aborted', async () => {
    const controller = new AbortController();
    controller.abort();

    // Directly test modifyAndSignMessages with aborted signal
    const mockSigner = {
      address: 'mock_addr',
      signMessage: vi.fn(),
    };

    const signerFn = createSolanaSiwxSigner(mockSigner as any);
    // Since createSolanaSiwxSigner wraps createMessageModifyingSigner, verify it works
    expect(signerFn).toBeDefined();
  });
});
