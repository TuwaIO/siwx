import { address, compileOffchainMessageV1Envelope, getBase58Decoder } from '@solana/kit';
import { buildMessage } from '@tuwaio/siwx-core';
import { describe, expect, it, vi } from 'vitest';

import { createSolanaSiwxSigner } from './signer';
import { verifyEd25519 } from './verify';

describe('createSolanaSiwxSigner', () => {
  it('signs with an @solana/kit message signer (modifyAndSignMessages)', async () => {
    const mockSigner = {
      address: 'mock_address',
      modifyAndSignMessages: vi.fn().mockResolvedValue([{ signatures: { mock_address: new Uint8Array([1, 2, 3]) } }]),
    };

    const signature = await createSolanaSiwxSigner(mockSigner as any)('test message');

    expect(signature).toBe(getBase58Decoder().decode(new Uint8Array([1, 2, 3])));
    expect(mockSigner.modifyAndSignMessages).toHaveBeenCalled();
  });

  it('rejects an @solana/kit message signer that returns no signature for its address', async () => {
    const mockSigner = {
      address: 'mock_address',
      modifyAndSignMessages: vi.fn().mockResolvedValue([{ signatures: {} }]),
    };

    await expect(createSolanaSiwxSigner(mockSigner as any)('test')).rejects.toThrow(
      '[SIWX-SOLANA] Signing failed: [SIWX-SOLANA] Signature missing for address: mock_address',
    );
  });

  it('signs with the shared signer of @tuwaio/orbit-solana: features, adapters and methods called on their owner', async () => {
    const wallet = {
      features: {
        'solana:signMessage': {
          version: '1.0.0',
          signMessage: vi.fn().mockResolvedValue([{ signature: new Uint8Array([10, 20, 30]) }]),
        },
      },
    };
    expect(await createSolanaSiwxSigner({ wallet } as any)('wallet standard')).toBe(
      getBase58Decoder().decode(new Uint8Array([10, 20, 30])),
    );

    class Adapter {
      readonly signature = new Uint8Array([4, 5, 6]);
      async signMessages(this: Adapter) {
        return [{ signature: this.signature }];
      }
    }
    expect(await createSolanaSiwxSigner({ wallet: new Adapter() })('adapter')).toBe(
      getBase58Decoder().decode(new Uint8Array([4, 5, 6])),
    );
  });

  it('wraps the errors of the signer, keeping the original error as cause', async () => {
    await expect(createSolanaSiwxSigner(null as any)('test')).rejects.toThrow(
      '[SIWX-SOLANA] Signing failed: [SIWX-SOLANA] Invalid signer target.',
    );
    await expect(createSolanaSiwxSigner({} as any)('test')).rejects.toThrow(
      '[SIWX-SOLANA] Signing failed: [SIWX-SOLANA] Signer lacks known message signing capabilities.',
    );

    const rejected = new Error('User rejected the request.');
    const error = await createSolanaSiwxSigner({ signMessage: vi.fn().mockRejectedValue(rejected) })('test').then(
      () => undefined,
      (caught: Error) => caught,
    );
    expect(error?.message).toBe('[SIWX-SOLANA] Signing failed: User rejected the request.');
    expect(error?.cause).toBe(rejected);
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

  /** The shape of `useWallet()` from `@solana/wallet-adapter-react` 0.15 (`WalletContextState`), with `wallet: null`. */
  function walletAdapterV1(account: Awaited<ReturnType<typeof createAccount>>) {
    return {
      wallet: null,
      publicKey: { toBase58: () => account.address },
      connected: true,
      signMessage: vi.fn(
        async (message: Uint8Array) =>
          new Uint8Array(
            await globalThis.crypto.subtle.sign('Ed25519', account.keyPair.privateKey, new Uint8Array(message)),
          ),
      ),
    };
  }

  it('signs with useWallet() of @solana/wallet-adapter-react 0.15 when its wallet is null', async () => {
    const account = await createAccount();
    const target = walletAdapterV1(account);
    const message = messageFor(account.address);

    const signature = await createSolanaSiwxSigner(target)(message);

    expect(target.signMessage).toHaveBeenCalledWith(new TextEncoder().encode(message));
    expect((await verifyEd25519({ message, signature })).success).toBe(true);
  });

  it('rejects useWallet() of @solana/wallet-adapter-react 0.15 before a wallet connects', async () => {
    const target = { wallet: null, publicKey: null, connected: false, signMessage: undefined };

    await expect(createSolanaSiwxSigner(target)('test')).rejects.toThrow(
      '[SIWX-SOLANA] Signer lacks known message signing capabilities.',
    );
  });

  it('signs the off-chain message with useWallet() of @solana/wallet-adapter v3 when its wallet and account are null', async () => {
    const account = await createAccount();
    const target = {
      wallet: null,
      account: null,
      address: account.address,
      publicKey: { toBase58: () => account.address },
      signMessage: undefined,
      signOffchainMessage: vi.fn((message: string) => signEnvelope(account.keyPair, account.address, message)),
    };
    const message = messageFor(account.address);

    const signature = await createSolanaSiwxSigner(target)(message);

    expect(target.signOffchainMessage).toHaveBeenCalledWith(message);
    expect((await verifyEd25519({ message, signature })).success).toBe(true);
  });
});
