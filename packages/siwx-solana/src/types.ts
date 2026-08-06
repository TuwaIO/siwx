/**
 * @fileoverview Solana-specific types for the @tuwaio/siwx-solana package.
 */

import type { SiwxVerifyPayload } from '@tuwaio/siwx-core';

/**
 * Minimal Wallet Standard account interface returned by `solana:signIn`.
 */
export interface SolanaSignInAccount {
  /** Base58 encoded wallet address. */
  address: string;
  /** Raw public key bytes. */
  publicKey?: Uint8Array;
}

/**
 * Output object structure returned by Wallet Standard `solana:signIn` feature.
 */
export interface SolanaSignInOutput {
  /** Account that signed the message. */
  account: SolanaSignInAccount;
  /** Raw message bytes or string that was signed. */
  signedMessage: Uint8Array | string;
  /** Raw signature bytes or base58 string. */
  signature: Uint8Array | string;
}

/**
 * Flexible input type for Solana SIWX verification.
 * Accepts standard SIWX payload `{ message, signature }`,
 * raw Uint8Array buffers, or Wallet Standard `solana:signIn` output objects.
 */
export type SolanaVerifyPayload =
  | SiwxVerifyPayload
  | { message: string | Uint8Array; signature: string | Uint8Array }
  | SolanaSignInOutput
  | { output: SolanaSignInOutput };
