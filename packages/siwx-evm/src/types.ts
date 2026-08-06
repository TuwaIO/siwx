/**
 * @fileoverview EVM-specific types for the @tuwaio/siwx-evm package.
 */

import type { SiwxVerifyPayload, SiwxVerifyResult } from '@tuwaio/siwx-core';
import type { Address, Hex, PublicClient } from 'viem';

/**
 * Options for the EVM signature verifier.
 */
export interface EvmVerifyOptions {
  /**
   * A viem `PublicClient` instance connected to the appropriate network.
   * Required for EIP-1271 (smart contract wallet) verification.
   * If not provided, only EIP-191 (EOA) verification is performed.
   */
  publicClient?: PublicClient;

  /**
   * If true, skips checking if the message expirationTime has passed.
   * @default false
   */
  skipExpiration?: boolean;
}

/**
 * The payload for EVM signature verification, extending the base SIWX payload
 * with a typed `signature` field.
 */
export interface EvmVerifyPayload extends SiwxVerifyPayload {
  /** The EVM hex-encoded signature string. */
  signature: Hex;
}

/**
 * Result of an EIP-1271 contract signature check, indicating which verification path was used.
 */
export interface EvmVerifyResult extends SiwxVerifyResult {
  /**
   * The method used for verification.
   * - `eip191`: Standard EOA signature recovery.
   * - `eip1271`: Smart contract wallet verification via `isValidSignature`.
   */
  method?: 'eip191' | 'eip1271';
}

/**
 * The expected address extracted from a CAIP-10 formatted address string.
 * @internal
 */
export type ExtractedEvmAddress = Address;
