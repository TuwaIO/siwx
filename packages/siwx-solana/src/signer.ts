/**
 * @file Solana signer adapter for SIWX authentication: `@solana/kit` message signers here, every other target through
 * the shared message signer of `@tuwaio/orbit-solana`.
 */

import type { Address, MessageModifyingSigner } from '@solana/kit';
import { createSignableMessage, getBase58Decoder, getUtf8Encoder } from '@solana/kit';
import {
  createSolanaMessageSigner,
  type SolanaMessageFormat,
  type SolanaMessageSignerTarget,
} from '@tuwaio/orbit-solana/signer';
import type { Wallet, WalletAccount } from '@wallet-standard/base';

/**
 * How {@link createSolanaSiwxSigner} has the wallet sign the message:
 *
 * - `'auto'` (default): the UTF-8 bytes of the message, or its version 1 off-chain message when the account supports
 *   `solana:signOffchainMessage` but not `solana:signMessage` (as hardware wallet accounts may), or when the target
 *   has no other way to sign;
 * - `'message'`: always the UTF-8 bytes (`solana:signMessage` and the fallbacks of {@link SolanaSiwxSignerTarget});
 * - `'offchainMessage'`: always the version 1 off-chain message (`solana:signOffchainMessage`, or a
 *   `signOffchainMessage(message)` method such as the one of `useWallet()` from `@solana/wallet-adapter` v3).
 *
 * `verifyEd25519` and `@tuwaio/siwx-server` accept both, so the format needs no server setting. The same type as
 * `SolanaMessageFormat` of `@tuwaio/orbit-solana`.
 */
export type SolanaSiwxMessageFormat = SolanaMessageFormat;

/**
 * Options of {@link createSolanaSiwxSigner}.
 */
export interface SolanaSiwxSignerOptions {
  /** How the wallet signs the message. Defaults to `'auto'`; see {@link SolanaSiwxMessageFormat}. */
  messageFormat?: SolanaSiwxMessageFormat;
}

/**
 * A Wallet Standard wallet and the account to sign with. The wallet must provide the `solana:signMessage` feature,
 * or `solana:signOffchainMessage` (see {@link SolanaSiwxMessageFormat}).
 */
export interface SolanaWalletStandardSignerTarget {
  /** The Wallet Standard wallet. */
  wallet: Wallet;
  /** The connected account, one of `wallet.accounts`. Its `address` identifies the signature. */
  account: WalletAccount;
}

/**
 * A legacy wallet adapter (for example from `@solana/wallet-adapter-react`) that signs raw message bytes.
 */
export interface SolanaLegacyMessageSigner {
  /**
   * Signs the message bytes.
   * @param message - UTF-8 bytes of the message.
   * @returns The 64-byte ed25519 signature, or an object that contains it.
   */
  signMessage(message: Uint8Array): Promise<Uint8Array | { signature: Uint8Array }>;
}

/**
 * The value of `useWallet()` from `@solana/wallet-adapter-react` (v1) or `@solana/wallet-adapter` (v3), or any other
 * `{ wallet, account }` objects with a signing capability, such as a wallet exposing an `adapter` or a `signMessages`
 * method: [`SolanaMessageSignerTarget`](https://orbit.docs.tuwa.io/packages/orbit-solana/interfaces/SolanaMessageSignerTarget)
 * of `@tuwaio/orbit-solana` (its fields are described there), whose signer signs it.
 *
 * Every field may be missing or `null`, as in `useWallet()` before a wallet connects: the signer looks for a signing
 * capability only when it is called, and rejects when it finds none.
 */
export type SolanaWalletAdapterSignerTarget = SolanaMessageSignerTarget;

/**
 * What {@link createSolanaSiwxSigner} can sign with:
 *
 * - a Wallet Standard `{ wallet, account }` pair ({@link SolanaWalletStandardSignerTarget});
 * - an `@solana/kit` `MessageModifyingSigner`;
 * - a legacy adapter with `signMessage(bytes)` ({@link SolanaLegacyMessageSigner});
 * - `useWallet()` of `@solana/wallet-adapter` v1 or v3, or any `{ wallet, account }` objects with one of these
 *   capabilities ({@link SolanaWalletAdapterSignerTarget}).
 *
 * An `@solana/kit` signer (`modifyAndSignMessages` on the target or its `wallet` or `account`) signs the UTF-8 bytes
 * itself. Every other target is signed by `createSolanaMessageSigner` of `@tuwaio/orbit-solana`, which uses the first
 * capability it finds: the `solana:signMessage` feature, a `signMessages` method, or a `signMessage` method (looked up
 * on `wallet`, its `adapter`, `account` and the target itself, so `useWallet()` of `@solana/wallet-adapter` v1 and v3
 * works as is). Off-chain messages use the `solana:signOffchainMessage` feature of `wallet.features` or a
 * `signOffchainMessage` method.
 */
export type SolanaSiwxSignerTarget =
  | SolanaWalletStandardSignerTarget
  | MessageModifyingSigner
  | SolanaLegacyMessageSigner
  | SolanaWalletAdapterSignerTarget;

/** The `@solana/kit` message signer of the target, if it is one or holds one as its `wallet` or `account`. */
function findKitSigner(target: object): MessageModifyingSigner<string> | undefined {
  const { wallet, account } = target as { wallet?: unknown; account?: unknown };
  return [wallet ?? target, account ?? target].find(
    (candidate) => typeof (candidate as { modifyAndSignMessages?: unknown })?.modifyAndSignMessages === 'function',
  ) as MessageModifyingSigner<string> | undefined;
}

/** Signs the UTF-8 bytes of `message` with an `@solana/kit` message signer and returns the base58 signature. */
async function signWithKitSigner(signer: MessageModifyingSigner<string>, message: string): Promise<string> {
  const signableMessage = createSignableMessage(new Uint8Array(getUtf8Encoder().encode(message)));
  const [signedMessage] = await signer.modifyAndSignMessages([signableMessage]);
  if (!signedMessage) throw new Error('[SIWX-SOLANA] No signed message returned.');
  const signature = signedMessage.signatures[signer.address as Address];
  if (!signature) throw new Error(`[SIWX-SOLANA] Signature missing for address: ${signer.address}`);
  return getBase58Decoder().decode(signature);
}

/**
 * Creates a SIWX signer for Solana wallets: a function that signs a message with the wallet and returns the ed25519
 * signature as a base58 string. Pass it as `signer` to `useSiwx().signIn` from `@tuwaio/siwx-react`.
 *
 * Works with Wallet Standard wallets, `@solana/kit` message signers, legacy adapters and `useWallet()` of
 * `@solana/wallet-adapter`; see {@link SolanaSiwxSignerTarget} for how the signing method is chosen. The wallet signs
 * the UTF-8 bytes of the message or its version 1 off-chain message (which hardware wallets can show and sign), as
 * `options.messageFormat` decides ({@link SolanaSiwxMessageFormat}); servers verify both. An `@solana/kit` signer
 * always signs the UTF-8 bytes, unless `messageFormat` is `'offchainMessage'`.
 *
 * @param target - The Wallet Standard wallet and account, an `@solana/kit` message signer or a legacy adapter.
 * @param options - `messageFormat`: `'auto'` (default), `'message'` or `'offchainMessage'`.
 * @returns An async signer. Calling it opens the wallet signature prompt; it rejects with an `Error` whose message
 * starts with `[SIWX-SOLANA] Signing failed:` (original error in `cause`) when the target has no signing
 * capability, the wallet rejects, cannot sign version 1 off-chain messages or signs a different off-chain message, or
 * no signature is returned for the account address.
 *
 * @example
 * ```ts
 * const signer = createSolanaSiwxSigner({ wallet, account });
 * const signature = await signer(message);
 * ```
 */
export function createSolanaSiwxSigner(target: SolanaSiwxSignerTarget, options: SolanaSiwxSignerOptions = {}) {
  const messageFormat = options.messageFormat ?? 'auto';
  const signMessage = createSolanaMessageSigner(target as SolanaMessageSignerTarget, {
    messageFormat,
    errorPrefix: '[SIWX-SOLANA]',
  });
  return async (message: string): Promise<string> => {
    try {
      const kitSigner = target && messageFormat !== 'offchainMessage' ? findKitSigner(target) : undefined;
      return await (kitSigner ? signWithKitSigner(kitSigner, message) : signMessage(message));
    } catch (err) {
      throw new Error(`[SIWX-SOLANA] Signing failed: ${(err as Error).message}`, { cause: err });
    }
  };
}
