/**
 * @fileoverview Solana signer adapter for SIWX authentication.
 */

import { createSignableMessage, getSignatureFromBytes, getUtf8Encoder } from 'gill';

/**
 * Target input for the Solana SIWX signer.
 * Supports Wallet Standard (`signMessages`), Web3 v2 (`modifyAndSignMessages`), and Legacy (`signMessage`) signers.
 */
export interface SolanaSiwxSignerTarget {
  address?: string;
  publicKey?: Uint8Array | unknown;
  account?: unknown;
  wallet?: unknown;
  features?: Record<string, unknown>;
  signMessages?: (messages: Uint8Array[]) => Promise<{ signature: Uint8Array }[]>;
  modifyAndSignMessages?: (messages: unknown[]) => Promise<{ signatures: Record<string, Uint8Array> }[]>;
  signMessage?: (message: Uint8Array) => Promise<Uint8Array | { signature: Uint8Array }>;
}

/**
 * Creates a standard SIWX signer callback for Solana chains.
 * Automatically adapts to Wallet Standard, Web3 v2 (gill), or legacy Solana signers.
 *
 * @param signer - A Solana signer object containing signing capabilities.
 * @returns A standardized signer function accepting a message string and returning a promise with the base58 signature.
 *
 * @example
 * ```ts
 * const signer = createSolanaSiwxSigner(connectedAccount);
 * const signature = await signer("Mini-Session Login: ...");
 * ```
 */
export function createSolanaSiwxSigner(signer: SolanaSiwxSignerTarget) {
  return async (message: string): Promise<string> => {
    const encoder = getUtf8Encoder();
    const messageBytes = encoder.encode(message) as unknown as Uint8Array;

    let signatureBytes: Uint8Array;

    const getFeature = (obj: unknown) => {
      if (!obj || typeof obj !== 'object') return undefined;
      const feat = (obj as { features?: Record<string, unknown> }).features;
      if (feat && typeof feat === 'object' && !Array.isArray(feat)) {
        return feat['solana:signMessage'];
      }
      return undefined;
    };

    const solanaSignMessageFeature =
      (getFeature(signer) as
        | {
            signMessage?: (input: { message: Uint8Array; account: unknown }[]) => Promise<{ signature: Uint8Array }[]>;
          }
        | undefined) ??
      (getFeature(signer.wallet) as
        | {
            signMessage?: (input: { message: Uint8Array; account: unknown }[]) => Promise<{ signature: Uint8Array }[]>;
          }
        | undefined) ??
      (getFeature(signer.account) as
        | {
            signMessage?: (input: { message: Uint8Array; account: unknown }[]) => Promise<{ signature: Uint8Array }[]>;
          }
        | undefined);

    // Case A: Wallet Standard (solana:signMessage feature)
    if (solanaSignMessageFeature?.signMessage) {
      const targetAccount = signer.account ?? (signer.address ? signer : undefined);
      const outputs = await solanaSignMessageFeature.signMessage([{ message: messageBytes, account: targetAccount }]);
      const output = outputs[0];
      if (!output?.signature) {
        throw new Error('[SIWX-SOLANA] Wallet returned invalid solana:signMessage output.');
      }
      signatureBytes = output.signature;
    }
    // Case B: Modern Web3 v2 (MessageModifyingSigner from gill / @solana/web3.js v2)
    else if (signer.modifyAndSignMessages) {
      if (!signer.address) {
        throw new Error('[SIWX-SOLANA] modifyAndSignMessages requires signer.address to be defined.');
      }

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
      signatureBytes = signature as unknown as Uint8Array;
    }
    // Case C: Wallet Standard direct helper (signMessages)
    else if (signer.signMessages) {
      const outputs = await signer.signMessages([messageBytes]);
      const output = outputs[0];
      if (!output?.signature) {
        throw new Error('[SIWX-SOLANA] Wallet returned invalid signMessages output.');
      }
      signatureBytes = output.signature;
    }
    // Case D: Legacy (signMessage)
    else if (signer.signMessage) {
      const result = await signer.signMessage(messageBytes);
      // Some legacy wallets return an object with a signature property, others return Uint8Array directly
      if (result instanceof Uint8Array) {
        signatureBytes = result;
      } else if (result && 'signature' in result && result.signature instanceof Uint8Array) {
        signatureBytes = result.signature;
      } else {
        throw new Error('[SIWX-SOLANA] Unexpected legacy signMessage result format.');
      }
    }
    // Case E: Injected browser extension provider (window.phantom?.solana / window.solana / window.solflare)
    else if (
      typeof window !== 'undefined' &&
      ((window as unknown as Record<string, unknown>).phantom ||
        (window as unknown as Record<string, unknown>).solana ||
        (window as unknown as Record<string, unknown>).solflare)
    ) {
      const win = window as unknown as Record<string, Record<string, unknown>>;
      const provider =
        (win.phantom?.solana as Record<string, unknown> | undefined) ??
        (win.solana as Record<string, unknown> | undefined) ??
        (win.solflare as Record<string, unknown> | undefined);

      if (typeof provider?.signMessage === 'function') {
        const result = await (
          provider.signMessage as (
            msg: Uint8Array,
            encoding?: string,
          ) => Promise<{ signature: Uint8Array } | Uint8Array>
        )(messageBytes, 'utf8');

        if (result && 'signature' in result && result.signature instanceof Uint8Array) {
          signatureBytes = result.signature;
        } else if (result instanceof Uint8Array) {
          signatureBytes = result;
        } else {
          throw new Error('[SIWX-SOLANA] Unexpected window provider signMessage result format.');
        }
      } else {
        throw new Error('[SIWX-SOLANA] Signer lacks known message signing capabilities.');
      }
    } else {
      throw new Error('[SIWX-SOLANA] Signer lacks known message signing capabilities.');
    }

    // Convert to base58 string representation
    return getSignatureFromBytes(signatureBytes as unknown as Parameters<typeof getSignatureFromBytes>[0]);
  };
}
