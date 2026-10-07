/**
 * @file EVM-specific types for the @tuwaio/siwx-evm package.
 */

import type { SiwxVerifyPayload, SiwxVerifyResult } from '@tuwaio/siwx-core';
import type { Address, Chain, Client, Hex, Transport } from 'viem';

/**
 * A viem client that reads a chain, such as the result of `createPublicClient`. Typed as viem's base `Client`, so the
 * clients of chains with their own formatters (OP Stack chains like Base and Optimism, zkSync, Celo) fit as well.
 */
export type EvmVerifyClient = Client<Transport, Chain | undefined>;

/**
 * Where the EVM verifiers get the client that checks smart contract wallet signatures: one client, or a function that
 * returns the client of an EVM chain by its chain number (`8453`), or `undefined` when the app has no client for that
 * chain. Use the function form when users sign in on more than one chain: a contract wallet can only be checked on
 * the chain it signed for.
 */
export type EvmPublicClientSource =
  EvmVerifyClient | ((chainId: number) => EvmVerifyClient | undefined | Promise<EvmVerifyClient | undefined>);

/**
 * Options of the EVM verifiers ({@link verifyEvmSignature}, {@link verifyEip191}, {@link verifyEip1271}).
 */
export interface EvmVerifyOptions {
  /**
   * The client that checks smart contract wallet signatures on the chain of the message: a viem client (for example
   * from `createPublicClient`), or a function that returns the client for a chain number (see
   * {@link EvmPublicClientSource}). A single client is used
   * only for messages of its own chain (`client.chain.id`); a client without a `chain` is used for every chain.
   * Required by {@link verifyEip1271}; without it, {@link verifyEvmSignature} only performs EIP-191 (EOA)
   * verification.
   */
  publicClient?: EvmPublicClientSource;

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
   * - `eip1271`: smart contract wallet check (`isValidSignature` of a deployed wallet).
   * - `erc6492`: smart contract wallet that is not deployed yet and signed with an ERC-6492 wrapper.
   */
  method?: 'eip191' | 'eip1271' | 'erc6492';
}

/**
 * The expected address extracted from a CAIP-10 formatted address string.
 * @internal
 */
export type ExtractedEvmAddress = Address;
