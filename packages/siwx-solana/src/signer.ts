/**
 * @file Solana signer adapter for SIWX authentication.
 */

import type { Address, MessageModifyingSigner, SignableMessage, SignatureBytes } from '@solana/kit';
import { createSignableMessage, getBase58Decoder, getUtf8Encoder } from '@solana/kit';
import type { Wallet, WalletAccount } from '@wallet-standard/base';

export interface SolanaSignMessageInput {
  readonly account: unknown;
  readonly message: Uint8Array;
}

export interface SolanaSignMessageOutput {
  readonly signedMessage: Uint8Array;
  readonly signature: Uint8Array;
}

export interface SolanaSignMessageFeature {
  readonly 'solana:signMessage': {
    readonly version: '1.0.0';
    readonly signMessage: (...inputs: readonly SolanaSignMessageInput[]) => Promise<readonly SolanaSignMessageOutput[]>;
  };
}

/**
 * A Wallet Standard wallet and the account to sign with. The wallet must provide the `solana:signMessage` feature.
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
 * What {@link createSolanaSiwxSigner} can sign with:
 *
 * - a Wallet Standard `{ wallet, account }` pair ({@link SolanaWalletStandardSignerTarget});
 * - an `@solana/kit` `MessageModifyingSigner`;
 * - a legacy adapter with `signMessage(bytes)` ({@link SolanaLegacyMessageSigner});
 * - any `{ wallet, account }` objects with one of these capabilities, such as a wallet exposing an `adapter` or a
 *   `signMessages` method.
 *
 * The signer uses the first capability it finds: `modifyAndSignMessages`, the `solana:signMessage` feature of
 * `wallet.features`, a `signMessages` method, or a `signMessage` method (also looked up on `adapter`).
 */
export type SolanaSiwxSignerTarget =
  | SolanaWalletStandardSignerTarget
  | MessageModifyingSigner
  | SolanaLegacyMessageSigner
  | { wallet?: object; account?: object };

function bytesEqual(a: Uint8Array, b: Uint8Array): boolean {
  if (a === b) return true;
  if (a.length !== b.length) return false;
  for (let i = 0; i < a.length; i++) {
    if (a[i] !== b[i]) return false;
  }
  return true;
}

/**
 * Ported from @solana/kit (createMessageSignerFromWalletAccount).
 * Wraps a standard Wallet Standard account or legacy adapter into a unified MessageModifyingSigner.
 */
function createMessageModifyingSigner(
  wallet: Record<string, unknown> | undefined,
  account: Record<string, unknown> | undefined,
): MessageModifyingSigner<string> {
  // If the passed object already implements modifyAndSignMessages, return it directly
  if (typeof (wallet as { modifyAndSignMessages?: unknown })?.modifyAndSignMessages === 'function') {
    return wallet as unknown as MessageModifyingSigner<string>;
  }
  if (typeof (account as { modifyAndSignMessages?: unknown })?.modifyAndSignMessages === 'function') {
    return account as unknown as MessageModifyingSigner<string>;
  }

  // Check for Wallet Standard solana:signMessage feature
  const accountFeatures = (account as { features?: unknown })?.features;
  const walletFeatures = (wallet as { features?: unknown })?.features;
  let signMessageFeature: SolanaSignMessageFeature['solana:signMessage'] | undefined;

  if (Array.isArray(accountFeatures) && accountFeatures.includes('solana:signMessage')) {
    if (walletFeatures && typeof walletFeatures === 'object' && !Array.isArray(walletFeatures)) {
      signMessageFeature = (walletFeatures as Record<string, unknown>)[
        'solana:signMessage'
      ] as SolanaSignMessageFeature['solana:signMessage'];
    }
  } else if (walletFeatures && typeof walletFeatures === 'object' && !Array.isArray(walletFeatures)) {
    signMessageFeature = (walletFeatures as Record<string, unknown>)[
      'solana:signMessage'
    ] as SolanaSignMessageFeature['solana:signMessage'];
  }

  const adapter = (wallet as { adapter?: unknown })?.adapter ?? (account as { adapter?: unknown })?.adapter;
  const legacySignMessage =
    (wallet as { signMessage?: unknown })?.signMessage ??
    (adapter as { signMessage?: unknown })?.signMessage ??
    (account as { signMessage?: unknown })?.signMessage;
  const signMessages =
    (wallet as { signMessages?: unknown })?.signMessages ?? (account as { signMessages?: unknown })?.signMessages;

  if (!signMessageFeature && !legacySignMessage && !signMessages) {
    throw new Error(`[SIWX-SOLANA] Signer lacks known message signing capabilities.`);
  }

  const accountAddress = String(
    (account as { address?: unknown })?.address ?? (wallet as { address?: unknown })?.address ?? 'solana:signer',
  ) as Address;

  return {
    address: accountAddress,
    async modifyAndSignMessages(
      messages: readonly SignableMessage[],
      config: { abortSignal?: AbortSignal } = {},
    ): Promise<readonly SignableMessage[]> {
      const abortSignal = config.abortSignal;
      if (abortSignal?.aborted) {
        throw new Error('Aborted');
      }

      if (messages.length === 0) {
        return messages;
      }

      const results: SignableMessage[] = [];

      for (let i = 0; i < messages.length; i++) {
        const originalMessage = messages[i];

        let signature: Uint8Array;
        let signedMessageBytes: Uint8Array;

        // 1. Wallet Standard solana:signMessage feature
        if (signMessageFeature) {
          const inputs = [{ account, message: originalMessage.content }];
          const outputs = await signMessageFeature.signMessage(...inputs);
          const output = outputs[0];
          if (!output || !output.signature) {
            throw new Error('[SIWX-SOLANA] Wallet returned invalid signMessage output.');
          }
          signature = output.signature;
          signedMessageBytes = output.signedMessage ?? originalMessage.content;
        }
        // 2. Direct signMessages method (standard in many adapters)
        else if (typeof signMessages === 'function') {
          const outputs = await (
            signMessages as (
              inputs: readonly { account: unknown; message: Uint8Array }[],
            ) => Promise<readonly { signature: Uint8Array; signedMessage?: Uint8Array }[]>
          )([{ account, message: originalMessage.content }]);
          const output = outputs[0];
          if (!output || !output.signature) {
            throw new Error('[SIWX-SOLANA] Wallet returned invalid signMessages output.');
          }
          signature = output.signature;
          signedMessageBytes = output.signedMessage ?? originalMessage.content;
        }
        // 3. Fallback to legacy single signMessage adapter
        else if (typeof legacySignMessage === 'function') {
          const result = await (legacySignMessage as (content: Uint8Array) => Promise<unknown>).call(
            adapter ?? wallet ?? account,
            originalMessage.content,
          );
          signedMessageBytes = originalMessage.content;
          if (
            result instanceof Uint8Array ||
            (result && (result as { buffer: unknown }).buffer instanceof ArrayBuffer)
          ) {
            signature = result as Uint8Array;
          } else if (result && typeof result === 'object' && 'signature' in result) {
            signature = (result as { signature: Uint8Array }).signature;
          } else {
            throw new Error('[SIWX-SOLANA] Unexpected legacy signMessage result format.');
          }
        } else {
          throw new Error('[SIWX-SOLANA] Missing signing implementation.');
        }

        // Check if message was modified
        const messageWasModified =
          originalMessage.content.length !== signedMessageBytes.length ||
          originalMessage.content.some((originalByte: number, ii: number) => originalByte !== signedMessageBytes[ii]);

        // Check if signature is new
        const originalSignature = originalMessage.signatures[accountAddress];
        const signatureIsNew = originalSignature === undefined || !bytesEqual(originalSignature, signature);

        if (!signatureIsNew && !messageWasModified) {
          results.push(originalMessage);
          continue;
        }

        const nextSignatureMap: Record<Address, SignatureBytes> = messageWasModified
          ? { [accountAddress]: signature as unknown as SignatureBytes }
          : { ...originalMessage.signatures, [accountAddress]: signature as unknown as SignatureBytes };

        results.push(
          Object.freeze({
            content: signedMessageBytes,
            signatures: Object.freeze(nextSignatureMap),
          }) as SignableMessage,
        );
      }

      return results;
    },
  };
}

/**
 * Creates a SIWX signer for Solana wallets: a function that signs a message (UTF-8 bytes) with the wallet and returns
 * the ed25519 signature as a base58 string. Pass it as `signer` to `useSiwx().signIn` from `@tuwaio/siwx-react`.
 *
 * Works with Wallet Standard wallets, `@solana/kit` message signers and legacy adapters; see
 * {@link SolanaSiwxSignerTarget} for how the signing method is chosen.
 *
 * @param target - The Wallet Standard wallet and account, an `@solana/kit` message signer or a legacy adapter.
 * @returns An async signer. Calling it opens the wallet signature prompt; it rejects with an `Error` whose message
 * starts with `[SIWX-SOLANA] Signing failed:` (original error in `cause`) when the target has no signing
 * capability, the wallet rejects, or no signature is returned for the account address.
 *
 * @example
 * ```ts
 * const signer = createSolanaSiwxSigner({ wallet, account });
 * const signature = await signer(message);
 * ```
 */
export function createSolanaSiwxSigner(target: SolanaSiwxSignerTarget) {
  return async (message: string): Promise<string> => {
    try {
      if (!target) {
        throw new Error('[SIWX-SOLANA] Invalid signer target.');
      }

      const { wallet: targetWallet, account: targetAccount } = target as { wallet?: object; account?: object };
      const wallet = (targetWallet ?? target) as Record<string, unknown>;
      const account = (targetAccount ?? target) as Record<string, unknown>;

      const encoder = getUtf8Encoder();
      const messageBytes = encoder.encode(message) as unknown as Uint8Array;

      // Wrap into unified MessageModifyingSigner
      const signer = createMessageModifyingSigner(wallet, account);

      const signableMessage = createSignableMessage(
        messageBytes as unknown as Parameters<typeof createSignableMessage>[0],
      );

      const signedMessages = await signer.modifyAndSignMessages([signableMessage]);
      const signedMessage = signedMessages[0];

      if (!signedMessage) throw new Error('[SIWX-SOLANA] No signed message returned.');

      const signature = signedMessage.signatures[signer.address as Address];
      if (!signature) {
        throw new Error(`[SIWX-SOLANA] Signature missing for address: ${signer.address}`);
      }

      return getBase58Decoder().decode(signature as Uint8Array);
    } catch (err) {
      throw new Error(`[SIWX-SOLANA] Signing failed: ${(err as Error).message}`, { cause: err });
    }
  };
}
