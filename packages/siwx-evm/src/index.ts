/**
 * @fileoverview Public API barrel for @tuwaio/siwx-evm.
 *
 * @packageDocumentation
 * @module @tuwaio/siwx-evm
 *
 * EVM adapter for the TUWA Sign-In With X (SIWX) ecosystem.
 * Provides CAIP-122 signature signing and verification for eip155 chains,
 * supporting both EIP-191 (EOA) and EIP-1271 (smart contract wallets).
 *
 * @see {@link https://eips.ethereum.org/EIPS/eip-191 EIP-191}
 * @see {@link https://eips.ethereum.org/EIPS/eip-1271 EIP-1271}
 * @see {@link https://github.com/TuwaIO/siwx Repository}
 */

export type { EvmVerifyOptions, EvmVerifyPayload, EvmVerifyResult } from './types';
export { verifyEip191, verifyEip1271, verifyEvmSignature } from './verify';
