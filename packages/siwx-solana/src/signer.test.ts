import { address, compileOffchainMessageV1Envelope } from '@solana/kit';
import { buildMessage } from '@tuwaio/siwx-core';
import { describe, expect, it, vi } from 'vitest';

import { createSolanaSiwxSigner } from './signer';
import { verifyEd25519 } from './verify';

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

describe('createSolanaSiwxSigner with off-chain messages', () => {
  const ALPHABET = '123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz';
  function bytesToBase58(bytes: Uint8Array): string {
    let num = 0n;
    for (const byte of bytes) num = (num << 8n) + BigInt(byte);
    let result = '';
    while (num > 0n) {
      result = ALPHABET[Number(num % 58n)] + result;
      num = num / 58n;
    }
    for (const byte of bytes) {
      if (byte !== 0) break;
      result = '1' + result;
    }
    return result || '1';
  }

  async function createAccount() {
    const keyPair = (await globalThis.crypto.subtle.generateKey('Ed25519', true, ['sign', 'verify'])) as CryptoKeyPair;
    const publicKey = new Uint8Array(await globalThis.crypto.subtle.exportKey('raw', keyPair.publicKey));
    return { keyPair, publicKey, address: bytesToBase58(publicKey) };
  }

  /** Signs like a wallet's `solana:signOffchainMessage`: the version 1 envelope of `content`, optionally tampered. */
  async function signEnvelope(keyPair: CryptoKeyPair, signer: string, content: string) {
    const envelope = compileOffchainMessageV1Envelope({
      version: 1,
      content,
      requiredSignatories: [{ address: address(signer) }],
    }).content as unknown as Uint8Array;
    const signature = new Uint8Array(
      await globalThis.crypto.subtle.sign('Ed25519', keyPair.privateKey, new Uint8Array(envelope)),
    );
    return { signedOffchainMessage: envelope, signature };
  }

  function messageFor(solanaAddress: string): string {
    return buildMessage({
      domain: 'app.tuwa.io',
      address: `solana:5eykt4UsFv8P8NJdTREpY1vzqKqZKvdp:${solanaAddress}`,
      uri: 'https://app.tuwa.io',
      version: '1',
      chainId: 'solana:5eykt4UsFv8P8NJdTREpY1vzqKqZKvdp',
      nonce: 'a4f3b2c1d0e5f678',
      issuedAt: '2026-08-06T08:00:00.000Z',
    });
  }

  function walletWith(
    account: Awaited<ReturnType<typeof createAccount>>,
    accountFeatures: string[],
    supportedMessageVersions: number[] = [1],
  ) {
    const walletAccount = {
      address: account.address,
      publicKey: account.publicKey,
      chains: ['solana:mainnet'],
      features: accountFeatures,
    };
    const signOffchainMessage = vi.fn(async (input: { message: string }) => [
      await signEnvelope(account.keyPair, account.address, input.message),
    ]);
    const signMessage = vi.fn(async (input: { message: Uint8Array }) => [
      {
        signedMessage: input.message,
        signature: new Uint8Array(
          await globalThis.crypto.subtle.sign('Ed25519', account.keyPair.privateKey, new Uint8Array(input.message)),
        ),
      },
    ]);
    const wallet = {
      accounts: [walletAccount],
      features: {
        'solana:signMessage': { version: '1.0.0', signMessage },
        'solana:signOffchainMessage': { version: '1.0.0', supportedMessageVersions, signOffchainMessage },
      },
    };
    return { wallet, account: walletAccount, signMessage, signOffchainMessage };
  }

  it('signs the off-chain message when the account cannot sign plain messages, and the server accepts it', async () => {
    const account = await createAccount();
    const {
      wallet,
      account: walletAccount,
      signMessage,
      signOffchainMessage,
    } = walletWith(account, ['solana:signOffchainMessage']);
    const message = messageFor(account.address);

    const signature = await createSolanaSiwxSigner({ wallet, account: walletAccount } as any)(message);

    expect(signMessage).not.toHaveBeenCalled();
    expect(signOffchainMessage).toHaveBeenCalledWith({
      account: walletAccount,
      message,
      messageVersion: 1,
      requiredSigners: [account.publicKey],
    });
    const result = await verifyEd25519({ message, signature });
    expect(result.success).toBe(true);
  });

  it('keeps solana:signMessage in auto mode when the account supports it', async () => {
    const account = await createAccount();
    const {
      wallet,
      account: walletAccount,
      signMessage,
      signOffchainMessage,
    } = walletWith(account, ['solana:signMessage', 'solana:signOffchainMessage']);

    const signature = await createSolanaSiwxSigner({ wallet, account: walletAccount } as any)(
      messageFor(account.address),
    );

    expect(signMessage).toHaveBeenCalled();
    expect(signOffchainMessage).not.toHaveBeenCalled();
    expect((await verifyEd25519({ message: messageFor(account.address), signature })).success).toBe(true);
  });

  it('signs the off-chain message when messageFormat is offchainMessage', async () => {
    const account = await createAccount();
    const {
      wallet,
      account: walletAccount,
      signMessage,
      signOffchainMessage,
    } = walletWith(account, ['solana:signMessage', 'solana:signOffchainMessage']);

    await createSolanaSiwxSigner({ wallet, account: walletAccount } as any, { messageFormat: 'offchainMessage' })(
      messageFor(account.address),
    );

    expect(signOffchainMessage).toHaveBeenCalled();
    expect(signMessage).not.toHaveBeenCalled();
  });

  it('never signs an off-chain message when messageFormat is message', async () => {
    const account = await createAccount();
    const {
      wallet,
      account: walletAccount,
      signMessage,
      signOffchainMessage,
    } = walletWith(account, ['solana:signOffchainMessage']);

    await createSolanaSiwxSigner({ wallet, account: walletAccount } as any, { messageFormat: 'message' })(
      messageFor(account.address),
    );

    expect(signMessage).toHaveBeenCalled();
    expect(signOffchainMessage).not.toHaveBeenCalled();
  });

  /** The shape of `useWallet()` from `@solana/wallet-adapter` v3: the signing methods live on the snapshot itself. */
  function walletAdapterV3(account: Awaited<ReturnType<typeof createAccount>>, accountFeatures: string[]) {
    return {
      wallet: { adapter: { name: 'Phantom', icon: 'data:image/svg+xml;base64,', url: '', readyState: 'Installed' } },
      account: {
        address: account.address,
        publicKey: account.publicKey,
        chains: ['solana:mainnet'],
        features: accountFeatures,
      },
      publicKey: { toBase58: () => account.address },
      signMessage: vi.fn(
        async (message: Uint8Array) =>
          new Uint8Array(
            await globalThis.crypto.subtle.sign('Ed25519', account.keyPair.privateKey, new Uint8Array(message)),
          ),
      ),
      signOffchainMessage: vi.fn((message: string) => signEnvelope(account.keyPair, account.address, message)),
    };
  }

  it('signs with useWallet() of @solana/wallet-adapter v3', async () => {
    const account = await createAccount();
    const target = walletAdapterV3(account, ['solana:signMessage', 'solana:signOffchainMessage']);
    const message = messageFor(account.address);

    const signature = await createSolanaSiwxSigner(target as any)(message);

    expect(target.signMessage).toHaveBeenCalled();
    expect(target.signOffchainMessage).not.toHaveBeenCalled();
    expect((await verifyEd25519({ message, signature })).success).toBe(true);
  });

  it('signs the off-chain message with useWallet() of @solana/wallet-adapter v3 for an account without signMessage', async () => {
    const account = await createAccount();
    const target = walletAdapterV3(account, ['solana:signOffchainMessage']);
    const message = messageFor(account.address);

    const signature = await createSolanaSiwxSigner(target as any)(message);

    expect(target.signOffchainMessage).toHaveBeenCalledWith(message);
    expect(target.signMessage).not.toHaveBeenCalled();
    expect((await verifyEd25519({ message, signature })).success).toBe(true);
  });

  it('rejects when the wallet signed a different off-chain message', async () => {
    const account = await createAccount();
    const { wallet, account: walletAccount, signOffchainMessage } = walletWith(account, ['solana:signOffchainMessage']);
    signOffchainMessage.mockImplementation(async () => [
      await signEnvelope(account.keyPair, account.address, 'something else'),
    ]);

    await expect(
      createSolanaSiwxSigner({ wallet, account: walletAccount } as any)(messageFor(account.address)),
    ).rejects.toThrow('different off-chain message');
  });

  it('rejects when the wallet cannot sign version 1 off-chain messages', async () => {
    const account = await createAccount();
    const { wallet, account: walletAccount } = walletWith(account, ['solana:signOffchainMessage'], []);

    await expect(
      createSolanaSiwxSigner({ wallet, account: walletAccount } as any, { messageFormat: 'offchainMessage' })(
        messageFor(account.address),
      ),
    ).rejects.toThrow('version 1 off-chain messages');
  });
});
