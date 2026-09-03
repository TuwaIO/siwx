/**
 * @fileoverview Solana signer adapter for SIWX authentication.
 */

import type { Address, MessageModifyingSigner, SignableMessage, SignatureBytes } from '@solana/kit';
import { createSignableMessage, getBase58Decoder, getUtf8Encoder } from '@solana/kit';

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
 * Target input for the Solana SIWX signer.
 * Accepts raw wallet and account objects, or a unified signer object.
 */
export interface SolanaSiwxSignerTarget {
  account?: Record<string, unknown>;
  wallet?: Record<string, unknown>;
  [key: string]: unknown;
}

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
 * Creates a standard SIWX signer callback for Solana chains.
 * Automatically adapts to Wallet Standard, Web3 v2 (@solana/kit), or legacy Solana signers.
 *
 * @param target - A Solana signer target containing raw wallet and account, or a direct signer instance.
 * @returns A standardized signer function accepting a message string and returning a promise with the base58 signature.
 */
export function createSolanaSiwxSigner(target: SolanaSiwxSignerTarget) {
  return async (message: string): Promise<string> => {
    try {
      if (!target) {
        throw new Error('[SIWX-SOLANA] Invalid signer target.');
      }

      const wallet = (target.wallet ?? target) as Record<string, unknown>;
      const account = (target.account ?? target) as Record<string, unknown>;

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
