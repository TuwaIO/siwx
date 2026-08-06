import { buildMessage } from '@tuwaio/siwx-core';
import { describe, expect, it } from 'vitest';

import { verifyEd25519 } from '../verify';

/** Helper to convert Uint8Array to Base58 string. */
function bytesToBase58(bytes: Uint8Array): string {
  const ALPHABET = '123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz';
  let num = BigInt(
    '0x' +
      Array.from(bytes)
        .map((b) => b.toString(16).padStart(2, '0'))
        .join(''),
  );
  let result = '';
  while (num > 0n) {
    const remainder = Number(num % 58n);
    num = num / 58n;
    result = ALPHABET[remainder] + result;
  }
  for (const byte of bytes) {
    if (byte === 0) {
      result = '1' + result;
    } else {
      break;
    }
  }
  return result || '1';
}

describe('verifyEd25519()', () => {
  it('successfully verifies a valid Solana Ed25519 signature generated via SubtleCrypto', async () => {
    // Generate a real Ed25519 keypair using Web Crypto API
    const keyPair = (await globalThis.crypto.subtle.generateKey('Ed25519', true, ['sign', 'verify'])) as CryptoKeyPair;

    const rawPublicKey = await globalThis.crypto.subtle.exportKey('raw', keyPair.publicKey);
    const solanaAddress = bytesToBase58(new Uint8Array(rawPublicKey));

    const message = buildMessage({
      domain: 'app.tuwa.io',
      address: `solana:5eykt4UsFv8P8NJdTREpY1vzqKqZKvdpK:${solanaAddress}`,
      uri: 'https://app.tuwa.io',
      version: '1',
      chainId: 'solana:5eykt4UsFv8P8NJdTREpY1vzqKqZKvdpK',
      nonce: 'a4f3b2c1d0e5f678',
      issuedAt: '2026-08-06T08:00:00.000Z',
    });

    const messageBytes = new TextEncoder().encode(message);
    const signatureBuffer = await globalThis.crypto.subtle.sign('Ed25519', keyPair.privateKey, messageBytes);
    const signatureBase58 = bytesToBase58(new Uint8Array(signatureBuffer));

    const result = await verifyEd25519({
      message,
      signature: signatureBase58,
    });

    expect(result.success).toBe(true);
    expect(result.data?.address).toBe(`solana:5eykt4UsFv8P8NJdTREpY1vzqKqZKvdpK:${solanaAddress}`);
  });

  it('fails verification when message is tampered', async () => {
    const keyPair = (await globalThis.crypto.subtle.generateKey('Ed25519', true, ['sign', 'verify'])) as CryptoKeyPair;

    const rawPublicKey = await globalThis.crypto.subtle.exportKey('raw', keyPair.publicKey);
    const solanaAddress = bytesToBase58(new Uint8Array(rawPublicKey));

    const message = buildMessage({
      domain: 'app.tuwa.io',
      address: `solana:5eykt4UsFv8P8NJdTREpY1vzqKqZKvdpK:${solanaAddress}`,
      uri: 'https://app.tuwa.io',
      version: '1',
      chainId: 'solana:5eykt4UsFv8P8NJdTREpY1vzqKqZKvdpK',
      nonce: 'a4f3b2c1d0e5f678',
      issuedAt: '2026-08-06T08:00:00.000Z',
    });

    const messageBytes = new TextEncoder().encode(message);
    const signatureBuffer = await globalThis.crypto.subtle.sign('Ed25519', keyPair.privateKey, messageBytes);
    const signatureBase58 = bytesToBase58(new Uint8Array(signatureBuffer));

    const tamperedMessage = message.replace('app.tuwa.io', 'hacked.com');

    const result = await verifyEd25519({
      message: tamperedMessage,
      signature: signatureBase58,
    });

    expect(result.success).toBe(false);
  });

  it('fails when chainId namespace is not solana', async () => {
    const keyPair = (await globalThis.crypto.subtle.generateKey('Ed25519', true, ['sign', 'verify'])) as CryptoKeyPair;

    const rawPublicKey = await globalThis.crypto.subtle.exportKey('raw', keyPair.publicKey);
    const solanaAddress = bytesToBase58(new Uint8Array(rawPublicKey));

    const message = buildMessage({
      domain: 'app.tuwa.io',
      address: `eip155:1:${solanaAddress}`,
      uri: 'https://app.tuwa.io',
      version: '1',
      chainId: 'eip155:1' as unknown as `solana:${string}`,
      nonce: 'a4f3b2c1d0e5f678',
      issuedAt: '2026-08-06T08:00:00.000Z',
    });

    const result = await verifyEd25519({
      message,
      signature: 'dummySignature',
    });

    expect(result.success).toBe(false);
    expect(result.error).toContain('Unsupported CAIP-2 namespace');
  });
});
