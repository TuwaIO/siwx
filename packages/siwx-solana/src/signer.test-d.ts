import type { SignatureBytes } from '@solana/kit';
import type { ReadonlyUint8Array, WalletAccount } from '@wallet-standard/base';
import { describe, it } from 'vitest';

import { createSolanaSiwxSigner } from './signer';

/** `PublicKey` of `@solana/web3.js`, reduced to its public methods. */
interface PublicKey {
  equals(publicKey: PublicKey): boolean;
  toBase58(): string;
  toBytes(): Uint8Array;
  toString(): string;
}

/** `WalletContextState` of `@solana/wallet-adapter-react` 0.15, the value of its `useWallet()`. */
interface WalletContextStateV1 {
  autoConnect: boolean;
  wallets: WalletV1[];
  wallet: WalletV1 | null;
  publicKey: PublicKey | null;
  connecting: boolean;
  connected: boolean;
  disconnecting: boolean;
  select(walletName: string | null): void;
  connect(): Promise<void>;
  disconnect(): Promise<void>;
  signMessage: ((message: Uint8Array) => Promise<Uint8Array>) | undefined;
}

interface WalletV1 {
  adapter: { name: string; icon: string; url: string; publicKey: PublicKey | null; connected: boolean };
  readyState: 'Installed' | 'NotDetected' | 'Loadable' | 'Unsupported';
}

/** `WalletContextState` of `@solana/wallet-adapter` v3, the value of its `useWallet()`. */
interface WalletContextStateV3 {
  readonly wallets: readonly WalletV3[];
  readonly selectedWallet: WalletV3 | null;
  readonly wallet: WalletV3 | null;
  readonly publicKey: PublicKey | null;
  readonly account: WalletAccount | null;
  readonly address: string | null;
  readonly connected: boolean;
  signMessage?: (message: Uint8Array) => Promise<SignatureBytes>;
  signOffchainMessage?: (
    message: string,
    options?: { requiredSigners?: readonly ReadonlyUint8Array[] },
  ) => Promise<{
    readonly signedOffchainMessage: ReadonlyUint8Array;
    readonly signature: SignatureBytes;
    readonly signatureType?: 'ed25519';
  }>;
}

interface WalletV3 {
  readonly adapter: { readonly name: string; readonly icon: string; readonly url: string; readonly readyState: string };
  readonly readyState: string;
}

declare const walletContextV1: WalletContextStateV1;
declare const walletContextV3: WalletContextStateV3;

describe('createSolanaSiwxSigner target type', () => {
  it('accepts useWallet() of @solana/wallet-adapter-react 0.15', () => {
    createSolanaSiwxSigner(walletContextV1);
  });

  it('accepts useWallet() of @solana/wallet-adapter v3', () => {
    createSolanaSiwxSigner(walletContextV3);
    createSolanaSiwxSigner(walletContextV3, { messageFormat: 'offchainMessage' });
  });

  it('accepts the nullable fields of useWallet() in an object literal', () => {
    createSolanaSiwxSigner({ wallet: null, publicKey: null, signMessage: walletContextV1.signMessage });
    createSolanaSiwxSigner({
      wallet: null,
      account: null,
      address: null,
      publicKey: walletContextV3.publicKey,
      signOffchainMessage: walletContextV3.signOffchainMessage,
    });
  });

  it('rejects a signMessage that does not sign message bytes', () => {
    // @ts-expect-error signMessage takes the UTF-8 bytes of the message
    createSolanaSiwxSigner({ wallet: null, signMessage: (message: string) => Promise.resolve(message) });
  });
});
