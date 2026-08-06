/**
 * @fileoverview EVM signature verification utilities for CAIP-122 messages.
 * Supports both EIP-191 (standard EOA wallets) and EIP-1271 (smart contract wallets).
 */

import {
  parseMessage,
  SiwxUnsupportedNamespaceError,
  SiwxValidationError,
  SiwxVerificationError,
  validateMessage,
} from '@tuwaio/siwx-core';
import type { Address, Hex } from 'viem';
import { hashMessage, recoverAddress } from 'viem';

import type { EvmVerifyOptions, EvmVerifyResult } from './types';

/** EIP-1271 magic value returned by smart contract wallets on valid signatures. */
const EIP_1271_MAGIC_VALUE = '0x1626ba7e';

/**
 * EIP-1271 `isValidSignature(bytes32,bytes)` ABI fragment.
 * @internal
 */
const EIP_1271_ABI = [
  {
    inputs: [
      { name: 'hash', type: 'bytes32' },
      { name: 'signature', type: 'bytes' },
    ],
    name: 'isValidSignature',
    outputs: [{ name: 'magicValue', type: 'bytes4' }],
    stateMutability: 'view',
    type: 'function',
  },
] as const;

/**
 * Extracts the plain EVM address from a CAIP-10 formatted string.
 * @example "eip155:1:0xAb5801..." → "0xAb5801..."
 * @internal
 */
function extractEvmAddress(caip10Address: string): Address {
  const parts = caip10Address.split(':');
  if (parts.length !== 3 || parts[0] !== 'eip155') {
    throw new SiwxVerificationError(`Expected eip155 CAIP-10 address format. Got: "${caip10Address}"`);
  }
  return parts[2] as Address;
}

/**
 * Verifies an EVM (eip155) CAIP-122 signature using EIP-191 (personal_sign).
 * This method is used for standard EOA (Externally Owned Account) wallets.
 *
 * @param message - The raw CAIP-122 message string that was signed.
 * @param signature - The hex-encoded EIP-191 signature from the wallet.
 * @returns An `EvmVerifyResult` with `success: true` and the parsed message, or an error result.
 *
 * @example
 * ```ts
 * const result = await verifyEip191(rawMessage, '0xdeadbeef...');
 * if (result.success) console.log('Authenticated as:', result.data?.address);
 * ```
 */
export async function verifyEip191(
  message: string,
  signature: Hex,
  options: EvmVerifyOptions = {},
): Promise<EvmVerifyResult> {
  try {
    const parsed = parseMessage(message);

    if (!parsed.chainId.startsWith('eip155:')) {
      throw new SiwxUnsupportedNamespaceError(parsed.chainId.split(':')[0] ?? 'unknown');
    }

    const validation = validateMessage(parsed, { skipExpiration: options.skipExpiration });
    if (!validation.valid) {
      throw new SiwxValidationError(validation.errors);
    }

    const expectedAddress = extractEvmAddress(parsed.address);
    const recoveredAddress = await recoverAddress({
      hash: hashMessage(message),
      signature,
    });

    if (recoveredAddress.toLowerCase() !== expectedAddress.toLowerCase()) {
      throw new SiwxVerificationError(
        `Signature recovery mismatch. Expected: ${expectedAddress}, got: ${recoveredAddress}`,
      );
    }

    return { success: true, data: parsed, method: 'eip191' };
  } catch (error) {
    if (error instanceof SiwxVerificationError || error instanceof SiwxValidationError) {
      return { success: false, error: error.message };
    }
    return { success: false, error: `EIP-191 verification failed: ${String(error)}` };
  }
}

/**
 * Verifies an EVM (eip155) CAIP-122 signature using EIP-1271 (`isValidSignature`).
 * This method is used for smart contract wallets (e.g., Safe, Argent, Gnosis).
 *
 * Falls back gracefully if the `publicClient` is not provided.
 *
 * @param message - The raw CAIP-122 message string that was signed.
 * @param signature - The hex-encoded signature from the smart contract wallet.
 * @param options - Options including the `publicClient` to use for on-chain calls.
 * @returns An `EvmVerifyResult` with `success: true` and the parsed message, or an error result.
 *
 * @example
 * ```ts
 * const result = await verifyEip1271(rawMessage, '0xdeadbeef...', { publicClient });
 * if (result.success) console.log('Contract wallet authenticated:', result.data?.address);
 * ```
 */
export async function verifyEip1271(
  message: string,
  signature: Hex,
  options: EvmVerifyOptions,
): Promise<EvmVerifyResult> {
  if (!options.publicClient) {
    return {
      success: false,
      error: 'EIP-1271 verification requires a publicClient to make on-chain calls.',
    };
  }

  try {
    const parsed = parseMessage(message);

    if (!parsed.chainId.startsWith('eip155:')) {
      throw new SiwxUnsupportedNamespaceError(parsed.chainId.split(':')[0] ?? 'unknown');
    }

    const validation = validateMessage(parsed, { skipExpiration: options.skipExpiration });
    if (!validation.valid) {
      throw new SiwxValidationError(validation.errors);
    }

    const contractAddress = extractEvmAddress(parsed.address);
    const messageHash = hashMessage(message);

    const magicValue = await options.publicClient.readContract({
      address: contractAddress,
      abi: EIP_1271_ABI,
      functionName: 'isValidSignature',
      args: [messageHash, signature],
    });

    if (magicValue !== EIP_1271_MAGIC_VALUE) {
      throw new SiwxVerificationError(`EIP-1271: isValidSignature returned invalid magic value: ${magicValue}`);
    }

    return { success: true, data: parsed, method: 'eip1271' };
  } catch (error) {
    if (error instanceof SiwxVerificationError || error instanceof SiwxValidationError) {
      return { success: false, error: error.message };
    }
    return { success: false, error: `EIP-1271 verification failed: ${String(error)}` };
  }
}
