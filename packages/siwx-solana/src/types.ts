/**
 * @file Solana-specific types for the @tuwaio/siwx-solana package.
 */

import type { SiwxVerifyPayload } from '@tuwaio/siwx-core';

/**
 * Minimal account shape of a Wallet Standard `solana:signIn` output.
 */
export interface SolanaSignInAccount {
  /** Base58-encoded wallet address. Not used for verification: the signer is taken from the message `address`. */
  address: string;
  /** Raw public key bytes. Not used for verification. */
  publicKey?: Uint8Array;
}

/**
 * Output of the Wallet Standard `solana:signIn` feature, accepted as-is by {@link verifyEd25519}.
 */
export interface SolanaSignInOutput {
  /** Account that signed the message. */
  account: SolanaSignInAccount;
  /** The signed message, as UTF-8 bytes or a string. It must be a CAIP-122 message. */
  signedMessage: Uint8Array | string;
  /** The ed25519 signature, as 64 raw bytes or a base58 string. */
  signature: Uint8Array | string;
}

/**
 * Input of {@link verifyEd25519}: a `{ message, signature }` payload (strings or bytes), a Wallet Standard
 * `solana:signIn` output, or that output wrapped as `{ output }`. String signatures are base58-encoded.
 */
export type SolanaVerifyPayload =
  | SiwxVerifyPayload
  | { message: string | Uint8Array; signature: string | Uint8Array }
  | SolanaSignInOutput
  | { output: SolanaSignInOutput };
