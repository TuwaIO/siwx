import * as wagmiCore from '@wagmi/core';
import { describe, expect, it, vi } from 'vitest';

import { createEvmSiwxSigner } from '../signer';

vi.mock('@wagmi/core', () => ({
  signMessage: vi.fn(),
}));

describe('createEvmSiwxSigner', () => {
  it('should handle Wagmi Config target', async () => {
    const mockWagmiConfig = { state: {}, connectors: [] } as any;
    const mockSignature = '0x123';

    vi.mocked(wagmiCore.signMessage).mockResolvedValueOnce(mockSignature);

    const signer = createEvmSiwxSigner(mockWagmiConfig, '0xabc');
    const signature = await signer('test message');

    expect(signature).toBe(mockSignature);
    expect(wagmiCore.signMessage).toHaveBeenCalledWith(mockWagmiConfig, { message: 'test message', account: '0xabc' });
  });

  it('should handle Viem WalletClient target', async () => {
    const mockWalletClient = {
      account: '0xdef',
      signMessage: vi.fn().mockResolvedValue('0x456'),
    } as any;

    const signer = createEvmSiwxSigner(mockWalletClient);
    const signature = await signer('test message viem');

    expect(signature).toBe('0x456');
    expect(mockWalletClient.signMessage).toHaveBeenCalledWith({ message: 'test message viem', account: '0xdef' });
  });

  it('should throw if Viem WalletClient lacks account and none provided', async () => {
    const mockWalletClient = {
      signMessage: vi.fn(),
    } as any;

    const signer = createEvmSiwxSigner(mockWalletClient);

    await expect(signer('msg')).rejects.toThrow('[SIWX-EVM] No account provided');
  });
});
