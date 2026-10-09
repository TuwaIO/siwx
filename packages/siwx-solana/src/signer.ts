/**
 * @file Solana signer adapter for SIWX authentication.
 */

import type { Address, MessageModifyingSigner, SignableMessage, SignatureBytes } from '@solana/kit';
import {
  address as toAddress,
  compileOffchainMessageV1Envelope,
  createSignableMessage,
  getAddressEncoder,
  getBase58Decoder,
  getUtf8Encoder,
} from '@solana/kit';
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

export interface SolanaSignOffchainMessageInput {
  readonly account: unknown;
  readonly message: string;
  readonly messageVersion: 1;
  readonly requiredSigners: readonly Uint8Array[];
}

export interface SolanaSignOffchainMessageOutput {
  readonly signedOffchainMessage?: Uint8Array;
  readonly signature: Uint8Array;
}

export interface SolanaSignOffchainMessageFeature {
  readonly 'solana:signOffchainMessage': {
    readonly version: '1.0.0';
    readonly supportedMessageVersions: readonly number[];
    readonly signOffchainMessage: (
      ...inputs: readonly SolanaSignOffchainMessageInput[]
    ) => Promise<readonly SolanaSignOffchainMessageOutput[]>;
  };
}

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
 * `verifyEd25519` and `@tuwaio/siwx-server` accept both, so the format needs no server setting.
 */
export type SolanaSiwxMessageFormat = 'auto' | 'message' | 'offchainMessage';

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
 * What {@link createSolanaSiwxSigner} can sign with:
 *
 * - a Wallet Standard `{ wallet, account }` pair ({@link SolanaWalletStandardSignerTarget});
 * - an `@solana/kit` `MessageModifyingSigner`;
 * - a legacy adapter with `signMessage(bytes)` ({@link SolanaLegacyMessageSigner});
 * - any `{ wallet, account }` objects with one of these capabilities, such as a wallet exposing an `adapter` or a
 *   `signMessages` method.
 *
 * The signer uses the first capability it finds: `modifyAndSignMessages`, the `solana:signMessage` feature of
 * `wallet.features`, a `signMessages` method, or a `signMessage` method (looked up on `wallet`, its `adapter`, `account`
 * and the target itself, so `useWallet()` of `@solana/wallet-adapter` v1 and v3 works as is). Off-chain messages use
 * the `solana:signOffchainMessage` feature of `wallet.features` or a `signOffchainMessage` method.
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
  root?: Record<string, unknown>,
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
  const legacySignMessageOwner = [wallet, adapter, account, root].find(
    (candidate) => typeof (candidate as { signMessage?: unknown } | undefined)?.signMessage === 'function',
  );
  const legacySignMessage = (legacySignMessageOwner as { signMessage?: unknown } | undefined)?.signMessage;
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
            legacySignMessageOwner,
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
 * How the target signs off-chain messages: a function, or why it cannot.
 * @internal
 */
type OffchainMessageSigning =
  | { sign: (message: string) => Promise<SolanaSignOffchainMessageOutput>; error?: undefined }
  | { sign?: undefined; error: string }
  | undefined;

/**
 * Finds how the target signs version 1 off-chain messages: the `solana:signOffchainMessage` feature of the wallet, or
 * a `signOffchainMessage(message)` method of the wallet, the account or the target itself.
 * @internal
 */
function findOffchainMessageSigning(
  wallet: Record<string, unknown>,
  account: Record<string, unknown>,
  root: Record<string, unknown>,
): OffchainMessageSigning {
  const walletFeatures = (wallet as { features?: unknown }).features;
  const feature =
    walletFeatures && typeof walletFeatures === 'object' && !Array.isArray(walletFeatures)
      ? ((walletFeatures as Record<string, unknown>)['solana:signOffchainMessage'] as
          SolanaSignOffchainMessageFeature['solana:signOffchainMessage'] | undefined)
      : undefined;

  if (feature && typeof feature.signOffchainMessage === 'function') {
    if (!feature.supportedMessageVersions?.includes(1)) {
      return { error: 'The wallet cannot sign version 1 off-chain messages.' };
    }
    return {
      async sign(message) {
        const outputs = await feature.signOffchainMessage({
          account,
          message,
          messageVersion: 1,
          requiredSigners: [accountPublicKey(account)],
        });
        const output = outputs[0];
        if (!output?.signature) throw new Error('[SIWX-SOLANA] Wallet returned invalid signOffchainMessage output.');
        return output;
      },
    };
  }

  const owner = [wallet, account, root].find(
    (candidate) => typeof (candidate as { signOffchainMessage?: unknown }).signOffchainMessage === 'function',
  );
  if (owner) {
    const method = (owner as { signOffchainMessage: (message: string) => Promise<SolanaSignOffchainMessageOutput> })
      .signOffchainMessage;
    return {
      async sign(message) {
        const output = await method.call(owner, message);
        if (!output?.signature) throw new Error('[SIWX-SOLANA] Wallet returned invalid signOffchainMessage output.');
        return output;
      },
    };
  }
  return undefined;
}

/**
 * The 32-byte public key of a Wallet Standard account: its `publicKey`, or the bytes of its base58 `address`.
 * @internal
 */
function accountPublicKey(account: Record<string, unknown>): Uint8Array {
  const publicKey = (account as { publicKey?: unknown }).publicKey;
  if (publicKey instanceof Uint8Array) return publicKey;
  return new Uint8Array(getAddressEncoder().encode(toAddress(String((account as { address?: unknown }).address))));
}

/**
 * The base58 address of the signing account, if the target names one.
 * @internal
 */
function signerAddress(
  wallet: Record<string, unknown>,
  account: Record<string, unknown>,
  root: Record<string, unknown>,
): string | undefined {
  for (const candidate of [account, wallet, root]) {
    const value = (candidate as { address?: unknown }).address;
    if (typeof value === 'string') return value;
  }
  const publicKey = (root as { publicKey?: { toBase58?: () => string } }).publicKey;
  return typeof publicKey?.toBase58 === 'function' ? publicKey.toBase58() : undefined;
}

/**
 * Signs `message` as a version 1 off-chain message and returns the base58 signature. When the wallet returns the
 * bytes it signed and the signing address is known, checks that they are the envelope of `message`.
 * @internal
 */
async function signAsOffchainMessage(
  signing: NonNullable<OffchainMessageSigning>,
  message: string,
  address: string | undefined,
): Promise<string> {
  if (!signing.sign) throw new Error(`[SIWX-SOLANA] ${signing.error}`);
  const output = await signing.sign(message);
  if (output.signedOffchainMessage && address) {
    const expected = compileOffchainMessageV1Envelope({
      version: 1,
      content: message,
      requiredSignatories: [{ address: toAddress(address) }],
    }).content as unknown as Uint8Array;
    if (!bytesEqual(new Uint8Array(output.signedOffchainMessage), expected)) {
      throw new Error('[SIWX-SOLANA] Wallet signed a different off-chain message than requested.');
    }
  }
  return getBase58Decoder().decode(new Uint8Array(output.signature));
}

/**
 * Tells whether the account lists `feature` among its features. Accounts that do not list features support all of
 * the wallet's.
 * @internal
 */
function accountSupports(account: Record<string, unknown>, feature: string): boolean {
  const features = (account as { features?: unknown }).features;
  return !Array.isArray(features) || features.includes(feature);
}

/**
 * Creates a SIWX signer for Solana wallets: a function that signs a message with the wallet and returns the ed25519
 * signature as a base58 string. Pass it as `signer` to `useSiwx().signIn` from `@tuwaio/siwx-react`.
 *
 * Works with Wallet Standard wallets, `@solana/kit` message signers, legacy adapters and `useWallet()` of
 * `@solana/wallet-adapter`; see {@link SolanaSiwxSignerTarget} for how the signing method is chosen. The wallet signs
 * the UTF-8 bytes of the message or its version 1 off-chain message (which hardware wallets can show and sign), as
 * `options.messageFormat` decides ({@link SolanaSiwxMessageFormat}); servers verify both.
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
  return async (message: string): Promise<string> => {
    try {
      if (!target) {
        throw new Error('[SIWX-SOLANA] Invalid signer target.');
      }

      const root = target as Record<string, unknown>;
      const { wallet: targetWallet, account: targetAccount } = target as { wallet?: object; account?: object };
      const wallet = (targetWallet ?? target) as Record<string, unknown>;
      const account = (targetAccount ?? target) as Record<string, unknown>;

      const offchainSigning =
        messageFormat === 'message' ? undefined : findOffchainMessageSigning(wallet, account, root);
      if (messageFormat === 'offchainMessage') {
        if (!offchainSigning) throw new Error('[SIWX-SOLANA] Signer cannot sign off-chain messages.');
        return await signAsOffchainMessage(offchainSigning, message, signerAddress(wallet, account, root));
      }

      let signer: MessageModifyingSigner<string> | undefined;
      try {
        signer = createMessageModifyingSigner(wallet, account, root);
      } catch (error) {
        if (!offchainSigning?.sign) throw error;
      }

      const preferOffchain =
        offchainSigning?.sign &&
        (!signer ||
          (!accountSupports(account, 'solana:signMessage') && accountSupports(account, 'solana:signOffchainMessage')));
      if (preferOffchain || !signer) {
        return await signAsOffchainMessage(offchainSigning!, message, signerAddress(wallet, account, root));
      }

      const encoder = getUtf8Encoder();
      const messageBytes = encoder.encode(message) as unknown as Uint8Array;

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
