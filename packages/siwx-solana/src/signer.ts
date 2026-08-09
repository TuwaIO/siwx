/**
 * @fileoverview Solana signer adapter for SIWX authentication.
 */

import {
  createSignableMessage,
  getSignatureFromBytes,
  getUtf8Encoder,
  MessageModifyingSigner,
  SignableMessage,
} from 'gill';

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
 * Accepts raw wallet and account objects.
 */
export interface SolanaSiwxSignerTarget {
  account: any;
  wallet: any;
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
function createMessageModifyingSigner(wallet: any, account: any): MessageModifyingSigner<string> {
  const accountAddress = account.address;
  if (!accountAddress) {
    throw new Error('[SIWX-SOLANA] Account address is missing.');
  }

  // Check for Wallet Standard solana:signMessage feature
  const accountFeatures = account.features;
  const walletFeatures = wallet.features;
  let signMessageFeature: SolanaSignMessageFeature['solana:signMessage'] | undefined;

  if (Array.isArray(accountFeatures) && accountFeatures.includes('solana:signMessage')) {
    if (walletFeatures && typeof walletFeatures === 'object' && !Array.isArray(walletFeatures)) {
      signMessageFeature = walletFeatures['solana:signMessage'];
    }
  }

  const adapter = wallet?.adapter;
  const legacySignMessage = wallet?.signMessage ?? adapter?.signMessage;

  if (!signMessageFeature && !legacySignMessage) {
    throw new Error(`[SIWX-SOLANA] Wallet lacks known message signing capabilities.`);
  }

  return {
    address: accountAddress,
    async modifyAndSignMessages(messages, config = {}) {
      const abortSignal = config.abortSignal;
      if (abortSignal?.aborted) {
        throw new Error('Aborted'); // Or standard abort error
      }

      if (messages.length === 0) {
        return messages;
      }

      const results: SignableMessage[] = [];

      for (let i = 0; i < messages.length; i++) {
        const originalMessage = messages[i];

        let signature: Uint8Array;
        let signedMessageBytes: Uint8Array;

        // If it's a Wallet Standard feature
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
        // Fallback to legacy adapter
        else if (legacySignMessage) {
          const result = await legacySignMessage.call(adapter ?? wallet, originalMessage.content);
          signedMessageBytes = originalMessage.content;
          if (result instanceof Uint8Array || (result && result.buffer instanceof ArrayBuffer)) {
            signature = result as Uint8Array;
          } else if (result && 'signature' in result) {
            signature = result.signature as Uint8Array;
          } else {
            throw new Error('[SIWX-SOLANA] Unexpected legacy signMessage result format.');
          }
        } else {
          throw new Error('[SIWX-SOLANA] Missing signing implementation.');
        }

        // Check if message was modified
        const messageWasModified =
          originalMessage.content.length !== signedMessageBytes.length ||
          originalMessage.content.some((originalByte, ii) => originalByte !== signedMessageBytes[ii]);

        // Check if signature is new
        const originalSignature = originalMessage.signatures[accountAddress];
        const signatureIsNew = originalSignature === undefined || !bytesEqual(originalSignature, signature);

        if (!signatureIsNew && !messageWasModified) {
          results.push(originalMessage);
          continue;
        }

        const nextSignatureMap = messageWasModified
          ? { [accountAddress]: signature }
          : { ...originalMessage.signatures, [accountAddress]: signature };

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
 * Automatically adapts to Wallet Standard, Web3 v2 (gill), or legacy Solana signers.
 *
 * @param target - A Solana signer target containing the raw wallet and account.
 * @returns A standardized signer function accepting a message string and returning a promise with the base58 signature.
 */
export function createSolanaSiwxSigner(target: SolanaSiwxSignerTarget) {
  return async (message: string): Promise<string> => {
    try {
      if (!target || !target.wallet || !target.account) {
        throw new Error('[SIWX-SOLANA] Invalid signer target. Wallet and Account are required.');
      }

      const encoder = getUtf8Encoder();
      const messageBytes = encoder.encode(message) as unknown as Uint8Array;

      // Wrap the wallet/account into a unified MessageModifyingSigner (@solana/kit pattern)
      const signer = createMessageModifyingSigner(target.wallet, target.account);

      const signableMessage = createSignableMessage(
        messageBytes as unknown as Parameters<typeof createSignableMessage>[0],
      );

      const signedMessages = await signer.modifyAndSignMessages([signableMessage]);
      const signedMessage = signedMessages[0];

      if (!signedMessage) throw new Error('[SIWX-SOLANA] No signed message returned.');

      const signature = signedMessage.signatures[signer.address];
      if (!signature) {
        throw new Error(`[SIWX-SOLANA] Signature missing for address: ${signer.address}`);
      }

      return getSignatureFromBytes(signature as unknown as Parameters<typeof getSignatureFromBytes>[0]);
    } catch (err) {
      throw new Error(`[SIWX-SOLANA] Signing failed: ${(err as Error).message}`, { cause: err });
    }
  };
}
