/**
 * @file Solana signature verification for CAIP-122 messages.
 * Uses ed25519 cryptography via the native SubtleCrypto API (Node.js & browser compatible).
 */

import { address as solanaAddress } from '@solana/kit';
import { parseCaip2ChainId, parseCaip10AccountId } from '@tuwaio/orbit-core';
import type { SiwxVerifyResult } from '@tuwaio/siwx-core';
import {
  parseMessage,
  SiwxUnsupportedNamespaceError,
  SiwxValidationError,
  SiwxVerificationError,
  validateMessage,
} from '@tuwaio/siwx-core';

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
 * Verifies a `solana` CAIP-122 message signed with ed25519.
 *
 * Parses the message, requires a `solana` chain and a 64-byte signature, runs `validateMessage` from `@tuwaio/siwx-core` (format,
 * expiration, `notBefore` and an `issuedAt` in the future), validates the message `address` with `@solana/kit` and checks the signature against
 * that public key with Web Crypto (`crypto.subtle`, algorithm `Ed25519`). Runs locally, without RPC calls. Nonce,
 * domain and policy checks are the caller's job (see `@tuwaio/siwx-server`).
 *
 * Requires a runtime with Ed25519 support in Web Crypto (current browsers, Node.js 20+, edge runtimes).
 *
 * @param payload - `{ message, signature }` (base58 string or bytes), or a Wallet Standard `solana:signIn` output.
 * @param options - `skipExpiration` skips the check that `expirationTime` has not passed.
 * @returns `{ success: true, data }`, or `{ success: false, error }`. Never throws: decoding, parse, validation and
 * crypto errors are returned as `error`.
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

    const namespace = parseCaip2ChainId(parsed.chainId)?.namespace;
    if (namespace !== 'solana') {
      throw new SiwxUnsupportedNamespaceError(namespace ?? 'unknown');
    }

    if (signatureBytes.length !== 64) {
      throw new SiwxVerificationError(`Invalid Solana signature length: ${signatureBytes.length} bytes (expected 64)`);
    }

    const validation = validateMessage(parsed, {
      skipExpiration: options?.skipExpiration,
      policy: { enforceNotBefore: true },
    });
    if (!validation.valid) {
      throw new SiwxValidationError(validation.errors);
    }

    const account = parseCaip10AccountId(parsed.address);
    if (account?.namespace !== 'solana') {
      throw new SiwxVerificationError(`Expected solana CAIP-10 address format. Got: "${parsed.address}"`);
    }
    const rawAddress = account.address;

    // Validate the address using @solana/kit's address utility
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
