/**
 * @file EVM-specific types for the @tuwaio/siwx-evm package.
 */

import type { SiwxVerifyPayload, SiwxVerifyResult } from '@tuwaio/siwx-core';
import type { Address, Hex, PublicClient } from 'viem';

/**
 * Options of the EVM verifiers ({@link verifyEvmSignature}, {@link verifyEip191}, {@link verifyEip1271}).
 */
export interface EvmVerifyOptions {
  /**
   * viem `PublicClient` connected to the chain of the message. Required by {@link verifyEip1271}; without it,
   * {@link verifyEvmSignature} only performs EIP-191 (EOA) verification. The verifiers do not check that the
   * client's chain matches the message `chainId`.
   */
  publicClient?: PublicClient;

  /**
   * Skips the check that the message `expirationTime` has not passed.
   * @default false
   */
  skipExpiration?: boolean;
}

/**
 * A signed CAIP-122 message with a hex-typed EVM signature. The verifiers of this package take the message and the
 * signature as separate arguments; this type is provided for typing request bodies.
 */
export interface EvmVerifyPayload extends SiwxVerifyPayload {
  /** The hex-encoded (`0x…`) signature returned by the wallet. */
  signature: Hex;
}

/**
 * Result of an EVM verification, with the method that succeeded.
 */
export interface EvmVerifyResult extends SiwxVerifyResult {
  /**
   * The verification method, set only when `success` is `true`.
   * - `eip191`: EOA signature recovery.
   * - `eip1271`: smart contract wallet check via `isValidSignature`.
   */
  method?: 'eip191' | 'eip1271';
}

/**
 * The expected address extracted from a CAIP-10 formatted address string.
 * @internal
 */
export type ExtractedEvmAddress = Address;
