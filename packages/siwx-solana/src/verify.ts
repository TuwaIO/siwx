/**
 * @fileoverview Solana signature verification for CAIP-122 messages.
 * Uses ed25519 cryptography via the native SubtleCrypto API (Node.js & browser compatible).
 */

import type { SiwxVerifyResult } from '@tuwaio/siwx-core';
import {
  parseMessage,
  SiwxUnsupportedNamespaceError,
  SiwxValidationError,
  SiwxVerificationError,
  validateMessage,
} from '@tuwaio/siwx-core';
import { address as solanaAddress } from 'gill';

import type { SolanaVerifyPayload } from './types';

/**
 * Decodes a base58-encoded string into a Uint8Array.
 * Used to decode Solana public keys and signatures.
 * @internal
 */
function base58ToBytes(base58: string): Uint8Array {
  const ALPHABET = '123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz';
  const alphabetMap = new Map(ALPHABET.split('').map((c, i) => [c, BigInt(i)]));

  let num = 0n;
  for (const char of base58) {
    const value = alphabetMap.get(char);
    if (value === undefined) {
      throw new SiwxVerificationError(`Invalid base58 character: "${char}"`);
    }
    num = num * 58n + value;
  }

  let hex = num.toString(16);
  if (hex.length % 2 !== 0) {
    hex = '0' + hex;
  }

  const rawBytes: number[] = [];
  for (let i = 0; i < hex.length; i += 2) {
    rawBytes.push(parseInt(hex.slice(i, i + 2), 16));
  }

  let leadingZeros = 0;
  for (const char of base58) {
    if (char === '1') {
      leadingZeros++;
    } else {
      break;
    }
  }

  const result = new Uint8Array(leadingZeros + rawBytes.length);
  result.set(rawBytes, leadingZeros);
  return result;
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
 * Normalizes input payload formats into raw message bytes, CAIP-122 string, and signature bytes.
 * Handles Wallet Standard `solana:signIn` output, `Uint8Array`, and standard base58 payloads.
 * @internal
 */
function normalizeSolanaPayload(payload: SolanaVerifyPayload): {
  messageString: string;
  messageBytes: Uint8Array;
  signatureBytes: Uint8Array;
} {
  const rawPayload = 'output' in payload ? payload.output : payload;

  const rawMessage = 'signedMessage' in rawPayload ? rawPayload.signedMessage : rawPayload.message;
  const rawSignature = rawPayload.signature;

  let messageString: string;
  let messageBytes: Uint8Array;

  if (rawMessage instanceof Uint8Array) {
    messageBytes = rawMessage;
    messageString = new TextDecoder().decode(rawMessage);
  } else {
    messageString = rawMessage;
    messageBytes = new TextEncoder().encode(rawMessage);
  }

  let signatureBytes: Uint8Array;
  if (rawSignature instanceof Uint8Array) {
    signatureBytes = rawSignature;
  } else {
    signatureBytes = base58ToBytes(rawSignature);
  }

  return { messageString, messageBytes, signatureBytes };
}

/**
 * Verifies a Solana CAIP-122 signature using ed25519 cryptography.
 * Compatible with all Wallet Standard wallets (Phantom, Solflare, Backpack, etc.)
 * and accepts raw `solana:signIn` output objects as well as string payloads.
 *
 * Uses the native `SubtleCrypto` API for ed25519 verification, ensuring
 * compatibility with both Node.js (v19+) and browser environments without polyfills.
 *
 * @param payload - Standard SIWX payload, Uint8Array buffers, or Wallet Standard `solana:signIn` output.
 * @param options - Verification options.
 * @returns A `SiwxVerifyResult` with `success: true` and parsed data, or an error result.
 *
 * @example
 * ```ts
 * const result = await verifyEd25519(solanaSignInOutput);
 * if (result.success) console.log('Authenticated:', result.data?.address);
 * ```
 */
export async function verifyEd25519(
  payload: SolanaVerifyPayload,
  options?: { skipExpiration?: boolean },
): Promise<SiwxVerifyResult> {
  try {
    const { messageString, messageBytes, signatureBytes } = normalizeSolanaPayload(payload);
    const parsed = parseMessage(messageString);

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
      messageBytes.buffer as ArrayBuffer,
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
