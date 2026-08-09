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
  name?: string;
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
    try {
      const encoder = getUtf8Encoder();
      const messageBytes = encoder.encode(message) as unknown as Uint8Array;

      let signatureBytes: Uint8Array;

      const getFeature = (obj: unknown) => {
        if (!obj || typeof obj !== 'object') return undefined;
        const feat = (obj as { features?: Record<string, unknown> }).features ?? obj;
        if (feat && typeof feat === 'object' && !Array.isArray(feat)) {
          const record = feat as Record<string, unknown>;
          return record['solana:signMessage'] ?? record['standard:signMessage'];
        }
        return undefined;
      };

      const solanaSignMessageFeature =
        getFeature(signer) ?? getFeature(signer.wallet) ?? getFeature(signer.account) ?? getFeature(signer.features);

      const signFn =
        typeof solanaSignMessageFeature === 'function'
          ? (solanaSignMessageFeature as unknown as (
              input: { message: Uint8Array; account: unknown }[],
            ) => Promise<{ signature: Uint8Array }[]>)
          : typeof (solanaSignMessageFeature as { signMessage?: unknown })?.signMessage === 'function'
            ? (
                solanaSignMessageFeature as {
                  signMessage: (
                    input: { message: Uint8Array; account: unknown }[],
                  ) => Promise<{ signature: Uint8Array }[]>;
                }
              ).signMessage
            : undefined;

      const modifyAndSignMessagesFn = signer.modifyAndSignMessages ?? (signer.wallet as any)?.modifyAndSignMessages;
      const signMessagesFn = signer.signMessages ?? (signer.wallet as any)?.signMessages;
      const legacySignMessageFn = signer.signMessage ?? (signer.wallet as any)?.signMessage;

      // Case A: Wallet Standard (solana:signMessage / standard:signMessage feature)
      if (signFn) {
        const targetAccount = signer.account ?? (signer.address ? signer : undefined);
        const outputs = await signFn([{ message: messageBytes, account: targetAccount }]);
        const output = outputs[0];
        if (!output?.signature) {
          throw new Error('[SIWX-SOLANA] Wallet returned invalid solana:signMessage output.');
        }
        signatureBytes = output.signature;
      }
      // Case B: Modern Web3 v2 (MessageModifyingSigner from gill / @solana/web3.js v2)
      else if (modifyAndSignMessagesFn) {
        if (!signer.address) {
          throw new Error('[SIWX-SOLANA] modifyAndSignMessages requires signer.address to be defined.');
        }

        const signableMessage = createSignableMessage(
          messageBytes as unknown as Parameters<typeof createSignableMessage>[0],
        );
        const signedMessages = await modifyAndSignMessagesFn([signableMessage]);
        const signedMessage = signedMessages[0];

        if (!signedMessage) throw new Error('[SIWX-SOLANA] No signed message returned.');

        const signature = signedMessage.signatures[signer.address];
        if (!signature) {
          throw new Error(`[SIWX-SOLANA] Signature missing for address: ${signer.address}`);
        }
        signatureBytes = signature as unknown as Uint8Array;
      }
      // Case C: Wallet Standard direct helper (signMessages)
      else if (signMessagesFn) {
        const outputs = await signMessagesFn([messageBytes]);
        const output = outputs[0];
        if (!output?.signature) {
          throw new Error('[SIWX-SOLANA] Wallet returned invalid signMessages output.');
        }
        signatureBytes = output.signature;
      }
      // Case D: Legacy (signMessage)
      else if (legacySignMessageFn) {
        const result = await legacySignMessageFn(messageBytes);
        // Some legacy wallets return an object with a signature property, others return Uint8Array directly
        if (result instanceof Uint8Array || (result && (result as any).buffer instanceof ArrayBuffer)) {
          signatureBytes = result as Uint8Array;
        } else if (result && 'signature' in result) {
          signatureBytes = result.signature as Uint8Array;
        } else {
          throw new Error('[SIWX-SOLANA] Unexpected legacy signMessage result format.');
        }
      }
      // Case E: Injected browser extension provider
      else if (typeof window !== 'undefined') {
        const rawWalletName =
          (signer.wallet as { name?: string })?.name ??
          (signer.account as { name?: string })?.name ??
          (signer as { name?: string })?.name ??
          '';
        const walletName = String(rawWalletName).toLowerCase();

        const win = window as unknown as Record<string, Record<string, unknown>>;
        let provider: Record<string, unknown> | undefined = undefined;

        // 1. Specific provider names
        if (walletName.includes('phantom')) {
          provider = win.phantom?.solana as Record<string, unknown> | undefined;
        } else if (walletName.includes('solflare')) {
          provider = win.solflare as Record<string, unknown> | undefined;
        } else if (walletName.includes('backpack')) {
          provider = win.backpack as Record<string, unknown> | undefined;
        } else if (walletName.includes('glow')) {
          provider = win.glow as Record<string, unknown> | undefined;
        } else if (walletName.includes('trust')) {
          provider = win.trustwallet as Record<string, unknown> | undefined;
        }

        // 2. Dynamic stripped name fallback
        if (!provider && walletName) {
          const strippedName = walletName.replace(/\s+/g, '');
          const dynamicProvider = win[strippedName] as Record<string, unknown> | undefined;
          if (dynamicProvider && typeof dynamicProvider.signMessage === 'function') {
            provider = dynamicProvider;
          }
        }

        // 3. Generic fallback
        if (!provider) {
          provider = win.solana as Record<string, unknown> | undefined;
        }

        if (provider && typeof provider.signMessage === 'function') {
          const result = await (
            provider.signMessage as (
              msg: Uint8Array,
              encoding?: string,
            ) => Promise<{ signature: Uint8Array } | Uint8Array>
          )(messageBytes, 'utf8');

          if (result instanceof Uint8Array || (result && (result as any).buffer instanceof ArrayBuffer)) {
            signatureBytes = result as Uint8Array;
          } else if (result && 'signature' in result) {
            signatureBytes = result.signature as Uint8Array;
          } else {
            throw new Error('[SIWX-SOLANA] Unexpected window provider signMessage result format.');
          }
        } else {
          throw new Error(
            `[SIWX-SOLANA] Wallet ${rawWalletName ? `"${rawWalletName}" ` : ''}lacks known message signing capabilities.`,
          );
        }
      } else {
        throw new Error('[SIWX-SOLANA] Signer lacks known message signing capabilities.');
      }

      // Convert to base58 string representation
      return getSignatureFromBytes(signatureBytes as unknown as Parameters<typeof getSignatureFromBytes>[0]);
    } catch (err) {
      throw new Error(`[SIWX-SOLANA] Signing failed: ${(err as Error).message}`, { cause: err });
    }
  };
}
