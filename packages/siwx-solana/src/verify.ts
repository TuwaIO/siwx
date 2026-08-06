/**
 * @fileoverview Solana signature verification for CAIP-122 messages.
 * Uses ed25519 cryptography via the native SubtleCrypto API (Node.js & browser compatible).
 */

import type { SiwxVerifyPayload, SiwxVerifyResult } from '@tuwaio/siwx-core';
import {
  parseMessage,
  SiwxUnsupportedNamespaceError,
  SiwxValidationError,
  SiwxVerificationError,
  validateMessage,
} from '@tuwaio/siwx-core';
import { address as solanaAddress } from 'gill';

/**
 * Decodes a base58-encoded string into a Uint8Array.
 * Used to decode Solana public keys and signatures.
 * @internal
 */
function base58ToBytes(base58: string): Uint8Array {
  const ALPHABET = '123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz';
  const alphabetMap = new Map(ALPHABET.split('').map((c, i) => [c, BigInt(i)]));

  let result = BigInt(0);
  for (const char of base58) {
    const value = alphabetMap.get(char);
    if (value === undefined) {
      throw new SiwxVerificationError(`Invalid base58 character: "${char}"`);
    }
    result = result * BigInt(58) + value;
  }

  const hex = result.toString(16).padStart(64, '0');
  const bytes = new Uint8Array(hex.length / 2);
  for (let i = 0; i < hex.length; i += 2) {
    bytes[i / 2] = parseInt(hex.slice(i, i + 2), 16);
  }
  return bytes;
}

/**
 * Extracts the plain Solana address from a CAIP-10 formatted string.
 * @example "solana:5eykt4UsFv8P8NJdTREpY1vzqKqZKvdp:4sGjM..." → "4sGjM..."
 * @internal
 */
function extractSolanaAddress(caip10Address: string): string {
  const parts = caip10Address.split(':');
  if (parts.length !== 3 || parts[0] !== 'solana') {
    throw new SiwxVerificationError(`Expected solana CAIP-10 address format. Got: "${caip10Address}"`);
  }
  return parts[2]!;
}

/**
 * Verifies a Solana CAIP-122 signature using ed25519 cryptography.
 * Compatible with all Wallet Standard wallets (Phantom, Solflare, Backpack, etc.).
 *
 * Uses the native `SubtleCrypto` API for ed25519 verification, ensuring
 * compatibility with both Node.js (v19+) and browser environments.
 *
 * @param payload - The CAIP-122 message string and the base58-encoded signature.
 * @returns A `SiwxVerifyResult` with `success: true` and parsed data, or an error result.
 *
 * @example
 * ```ts
 * const result = await verifyEd25519({
 *   message: rawCaip122Message,
 *   signature: base58EncodedSignature,
 * });
 * if (result.success) console.log('Authenticated:', result.data?.address);
 * ```
 */
export async function verifyEd25519(
  payload: SiwxVerifyPayload,
  options?: { skipExpiration?: boolean },
): Promise<SiwxVerifyResult> {
  try {
    const parsed = parseMessage(payload.message);

    if (!parsed.chainId.startsWith('solana:')) {
      throw new SiwxUnsupportedNamespaceError(parsed.chainId.split(':')[0] ?? 'unknown');
    }

    const validation = validateMessage(parsed, { skipExpiration: options?.skipExpiration });
    if (!validation.valid) {
      throw new SiwxValidationError(validation.errors);
    }

    const rawAddress = extractSolanaAddress(parsed.address);

    // Validate the address using gill's address utility
    const validatedAddress = solanaAddress(rawAddress);

    const publicKeyBytes = base58ToBytes(validatedAddress);
    const signatureBytes = base58ToBytes(payload.signature);
    const messageBytes = new TextEncoder().encode(payload.message);

    const cryptoKey = await globalThis.crypto.subtle.importKey(
      'raw',
      publicKeyBytes.buffer as ArrayBuffer,
      { name: 'Ed25519' },
      false,
      ['verify'],
    );

    const isValid = await globalThis.crypto.subtle.verify(
      { name: 'Ed25519' },
      cryptoKey,
      signatureBytes.buffer as ArrayBuffer,
      messageBytes,
    );

    if (!isValid) {
      throw new SiwxVerificationError(`ed25519 signature verification failed for address: ${rawAddress}`);
    }

    return { success: true, data: parsed };
  } catch (error) {
    if (error instanceof SiwxVerificationError || error instanceof SiwxValidationError) {
      return { success: false, error: error.message };
    }
    return { success: false, error: `ed25519 verification failed: ${String(error)}` };
  }
}
