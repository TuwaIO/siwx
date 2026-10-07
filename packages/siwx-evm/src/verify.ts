/**
 * @file EVM signature verification utilities for CAIP-122 messages.
 * Supports both EIP-191 (standard EOA wallets) and EIP-1271 (smart contract wallets).
 */

import { parseCaip2ChainId, parseCaip10AccountId, toEvmChainId } from '@tuwaio/orbit-core';
import {
  parseMessage,
  SiwxUnsupportedNamespaceError,
  SiwxValidationError,
  SiwxVerificationError,
  validateMessage,
} from '@tuwaio/siwx-core';
import type { Address, Hex } from 'viem';
import { hashMessage, isErc6492Signature, recoverAddress } from 'viem';
import { verifyMessage } from 'viem/actions';

import type { EvmPublicClientSource, EvmVerifyClient, EvmVerifyOptions, EvmVerifyResult } from './types';

/**
 * Extracts the plain EVM address from a CAIP-10 formatted string.
 * @example "eip155:1:0xAb5801..." → "0xAb5801..."
 * @internal
 */
function extractEvmAddress(caip10Address: string): Address {
  const account = parseCaip10AccountId(caip10Address);
  if (account?.namespace !== 'eip155') {
    throw new SiwxVerificationError(`Expected eip155 CAIP-10 address format. Got: "${caip10Address}"`);
  }
  return account.address as Address;
}

/**
 * Returns the client that checks a contract wallet on the chain of a message: the result of a client function for the
 * chain number, or a single client when its chain is that chain (or it has no chain).
 * @internal
 */
async function clientForChain(source: EvmPublicClientSource, chainId: string): Promise<EvmVerifyClient | undefined> {
  const chain = toEvmChainId(chainId);
  if (chain === undefined) return undefined;
  if (typeof source === 'function') return source(chain);
  return source.chain === undefined || source.chain.id === chain ? source : undefined;
}

/**
 * Throws for a message whose chain is not in the `eip155` namespace.
 * @throws {SiwxUnsupportedNamespaceError} If the chain ID is not an `eip155` CAIP-2 chain ID.
 * @internal
 */
function assertEip155Chain(chainId: string): void {
  const namespace = parseCaip2ChainId(chainId)?.namespace;
  if (namespace !== 'eip155') {
    throw new SiwxUnsupportedNamespaceError(namespace ?? 'unknown');
  }
}

/**
 * Verifies an `eip155` CAIP-122 message signed with EIP-191 (`personal_sign`) by an EOA wallet.
 *
 * Parses the message, requires an `eip155` chain, runs `validateMessage` from `@tuwaio/siwx-core` (format,
 * expiration, `notBefore` and an `issuedAt` in the future; no policy), recovers the signer from the signature and
 * compares it with the message `address` case-insensitively.
 * Runs locally, without RPC calls. Nonce, domain and policy checks are the caller's job (see `@tuwaio/siwx-server`).
 *
 * @param message - The exact CAIP-122 message string that was signed.
 * @param signature - The hex-encoded signature returned by the wallet.
 * @param options - Verification options; only `skipExpiration` is used.
 * @returns `{ success: true, data, method: 'eip191' }`, or `{ success: false, error }`. Never throws: parse,
 * validation and recovery errors are returned as `error`.
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

    assertEip155Chain(parsed.chainId);

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
 * Verifies an `eip155` CAIP-122 message signed by a smart contract wallet (Safe, Coinbase Smart Wallet / Base
 * Account, ERC-4337 accounts), deployed or not.
 *
 * Parses and validates the message like {@link verifyEip191}, takes the client of the message chain from
 * `options.publicClient` and checks the signature with viem's `verifyMessage`: `isValidSignature` (EIP-1271) of a
 * deployed wallet, and the ERC-6492 wrapper of a wallet that is not deployed yet, both in one `eth_call` through the
 * ERC-6492 universal validator (which also accepts an EOA signature). A single client of another chain is never used:
 * a contract wallet can only be checked on the chain it signed for.
 * Side effects: calls the client function, if one is given; one `eth_call` to the RPC endpoint of the client.
 *
 * @param message - The exact CAIP-122 message string that was signed.
 * @param signature - The hex-encoded signature returned by the wallet, ERC-6492 wrapped or not.
 * @param options - Must contain `publicClient`; `skipExpiration` is optional.
 * @returns `{ success: true, data, method: 'eip1271' }` (`'erc6492'` for a wrapped signature), or
 * `{ success: false, error }` (also when there is no client for the message chain or the call fails). Never throws.
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
      error: 'Smart contract wallet verification requires a publicClient to make on-chain calls.',
    };
  }

  try {
    const parsed = parseMessage(message);

    assertEip155Chain(parsed.chainId);

    const validation = validateMessage(parsed, { skipExpiration: options.skipExpiration });
    if (!validation.valid) {
      throw new SiwxValidationError(validation.errors);
    }

    const contractAddress = extractEvmAddress(parsed.address);
    const client = await clientForChain(options.publicClient, parsed.chainId);
    if (!client) {
      throw new SiwxVerificationError(`No publicClient for ${parsed.chainId} to check the contract wallet signature.`);
    }

    const valid = await verifyMessage(client, { address: contractAddress, message, signature });
    if (!valid) {
      throw new SiwxVerificationError('Smart contract wallet signature is not valid (EIP-1271 / ERC-6492).');
    }

    return { success: true, data: parsed, method: isErc6492Signature(signature) ? 'erc6492' : 'eip1271' };
  } catch (error) {
    if (error instanceof SiwxVerificationError || error instanceof SiwxValidationError) {
      return { success: false, error: error.message };
    }
    return { success: false, error: `Smart contract wallet verification failed: ${String(error)}` };
  }
}

/**
 * Verifies an `eip155` CAIP-122 signature from an EOA or a smart contract wallet.
 *
 * Tries {@link verifyEip191} first. If it fails and `options.publicClient` is set, falls back to
 * {@link verifyEip1271} with the client of the message chain (one on-chain `eth_call`), which accepts deployed
 * (EIP-1271) and not yet deployed (ERC-6492) smart contract wallets.
 *
 * @param message - The exact CAIP-122 message string that was signed.
 * @param signature - The hex-encoded signature returned by the wallet.
 * @param options - `publicClient` (a client or a function of the chain number) enables the contract wallet fallback;
 * `skipExpiration` is passed to both checks.
 * @returns The first successful result (with `method`), otherwise the failed result of the last check that ran.
 * Never throws.
 *
 * @example
 * ```ts
 * const result = await verifyEvmSignature(rawMessage, '0xdeadbeef...', { publicClient });
 * if (result.success) console.log('Authenticated via:', result.method);
 * ```
 */
export async function verifyEvmSignature(
  message: string,
  signature: Hex,
  options: EvmVerifyOptions = {},
): Promise<EvmVerifyResult> {
  const eip191Result = await verifyEip191(message, signature, options);
  if (eip191Result.success) {
    return eip191Result;
  }

  if (options.publicClient) {
    return verifyEip1271(message, signature, options);
  }

  return eip191Result;
}
