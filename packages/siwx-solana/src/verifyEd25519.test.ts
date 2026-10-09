import { address, compileOffchainMessageV1Envelope, signOffchainMessageEnvelope } from '@solana/kit';
import { buildMessage } from '@tuwaio/siwx-core';
import { describe, expect, it } from 'vitest';

import { verifyEd25519 } from './verify';

/** Helper to convert Uint8Array to Base58 string. */
function bytesToBase58(bytes: Uint8Array): string {
  const ALPHABET = '123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz';
  let num = 0n;
  for (const byte of bytes) {
    num = (num << 8n) + BigInt(byte);
  }
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
      address: `solana:5eykt4UsFv8P8NJdTREpY1vzqKqZKvdp:${solanaAddress}`,
      uri: 'https://app.tuwa.io',
      version: '1',
      chainId: 'solana:5eykt4UsFv8P8NJdTREpY1vzqKqZKvdp',
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
    expect(result.data?.address).toBe(`solana:5eykt4UsFv8P8NJdTREpY1vzqKqZKvdp:${solanaAddress}`);
  });

  it('fails verification when message is tampered', async () => {
    const keyPair = (await globalThis.crypto.subtle.generateKey('Ed25519', true, ['sign', 'verify'])) as CryptoKeyPair;

    const rawPublicKey = await globalThis.crypto.subtle.exportKey('raw', keyPair.publicKey);
    const solanaAddress = bytesToBase58(new Uint8Array(rawPublicKey));

    const message = buildMessage({
      domain: 'app.tuwa.io',
      address: `solana:5eykt4UsFv8P8NJdTREpY1vzqKqZKvdp:${solanaAddress}`,
      uri: 'https://app.tuwa.io',
      version: '1',
      chainId: 'solana:5eykt4UsFv8P8NJdTREpY1vzqKqZKvdp',
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

  it('fails when message is expired and skipExpiration is false', async () => {
    const keyPair = (await globalThis.crypto.subtle.generateKey('Ed25519', true, ['sign', 'verify'])) as CryptoKeyPair;
    const rawPublicKey = await globalThis.crypto.subtle.exportKey('raw', keyPair.publicKey);
    const solanaAddress = bytesToBase58(new Uint8Array(rawPublicKey));

    const message = buildMessage({
      domain: 'app.tuwa.io',
      address: `solana:5eykt4UsFv8P8NJdTREpY1vzqKqZKvdp:${solanaAddress}`,
      uri: 'https://app.tuwa.io',
      version: '1',
      chainId: 'solana:5eykt4UsFv8P8NJdTREpY1vzqKqZKvdp',
      nonce: 'a4f3b2c1d0e5f678',
      issuedAt: '2020-01-01T00:00:00.000Z',
      expirationTime: '2020-01-02T00:00:00.000Z',
    });

    const messageBytes = new TextEncoder().encode(message);
    const signatureBuffer = await globalThis.crypto.subtle.sign('Ed25519', keyPair.privateKey, messageBytes);
    const signatureBase58 = bytesToBase58(new Uint8Array(signatureBuffer));

    const result = await verifyEd25519({ message, signature: signatureBase58 });
    expect(result.success).toBe(false);
    expect(result.error).toContain('Message has expired');
  });

  it('succeeds when message is expired but skipExpiration is true', async () => {
    const keyPair = (await globalThis.crypto.subtle.generateKey('Ed25519', true, ['sign', 'verify'])) as CryptoKeyPair;
    const rawPublicKey = await globalThis.crypto.subtle.exportKey('raw', keyPair.publicKey);
    const solanaAddress = bytesToBase58(new Uint8Array(rawPublicKey));

    const message = buildMessage({
      domain: 'app.tuwa.io',
      address: `solana:5eykt4UsFv8P8NJdTREpY1vzqKqZKvdp:${solanaAddress}`,
      uri: 'https://app.tuwa.io',
      version: '1',
      chainId: 'solana:5eykt4UsFv8P8NJdTREpY1vzqKqZKvdp',
      nonce: 'a4f3b2c1d0e5f678',
      issuedAt: '2020-01-01T00:00:00.000Z',
      expirationTime: '2020-01-02T00:00:00.000Z',
    });

    const messageBytes = new TextEncoder().encode(message);
    const signatureBuffer = await globalThis.crypto.subtle.sign('Ed25519', keyPair.privateKey, messageBytes);
    const signatureBase58 = bytesToBase58(new Uint8Array(signatureBuffer));

    const result = await verifyEd25519({ message, signature: signatureBase58 }, { skipExpiration: true });
    expect(result.success).toBe(true);
  });

  it('fails when notBefore is in the future', async () => {
    const keyPair = (await globalThis.crypto.subtle.generateKey('Ed25519', true, ['sign', 'verify'])) as CryptoKeyPair;
    const rawPublicKey = await globalThis.crypto.subtle.exportKey('raw', keyPair.publicKey);
    const solanaAddress = bytesToBase58(new Uint8Array(rawPublicKey));

    const message = buildMessage({
      domain: 'app.tuwa.io',
      address: `solana:5eykt4UsFv8P8NJdTREpY1vzqKqZKvdp:${solanaAddress}`,
      uri: 'https://app.tuwa.io',
      version: '1',
      chainId: 'solana:5eykt4UsFv8P8NJdTREpY1vzqKqZKvdp',
      nonce: 'a4f3b2c1d0e5f678',
      issuedAt: '2026-08-06T08:00:00.000Z',
      notBefore: '2099-01-01T00:00:00.000Z',
    });

    const messageBytes = new TextEncoder().encode(message);
    const signatureBuffer = await globalThis.crypto.subtle.sign('Ed25519', keyPair.privateKey, messageBytes);
    const signatureBase58 = bytesToBase58(new Uint8Array(signatureBuffer));

    const result = await verifyEd25519({ message, signature: signatureBase58 });
    expect(result.success).toBe(false);
    expect(result.error).toContain('Message not valid before');
  });

  it('fails when signature contains invalid base58 characters', async () => {
    const keyPair = (await globalThis.crypto.subtle.generateKey('Ed25519', true, ['sign', 'verify'])) as CryptoKeyPair;
    const rawPublicKey = await globalThis.crypto.subtle.exportKey('raw', keyPair.publicKey);
    const solanaAddress = bytesToBase58(new Uint8Array(rawPublicKey));

    const message = buildMessage({
      domain: 'app.tuwa.io',
      address: `solana:5eykt4UsFv8P8NJdTREpY1vzqKqZKvdp:${solanaAddress}`,
      uri: 'https://app.tuwa.io',
      version: '1',
      chainId: 'solana:5eykt4UsFv8P8NJdTREpY1vzqKqZKvdp',
      nonce: 'a4f3b2c1d0e5f678',
      issuedAt: '2026-08-06T08:00:00.000Z',
    });

    const result = await verifyEd25519({
      message,
      signature: 'Invalid_Base58_With_Il0O!',
    });

    expect(result.success).toBe(false);
    expect(result.error).toContain('Invalid base58 character');
  });

  it('fails when signature has invalid byte length', async () => {
    const keyPair = (await globalThis.crypto.subtle.generateKey('Ed25519', true, ['sign', 'verify'])) as CryptoKeyPair;
    const rawPublicKey = await globalThis.crypto.subtle.exportKey('raw', keyPair.publicKey);
    const solanaAddress = bytesToBase58(new Uint8Array(rawPublicKey));

    const message = buildMessage({
      domain: 'app.tuwa.io',
      address: `solana:5eykt4UsFv8P8NJdTREpY1vzqKqZKvdp:${solanaAddress}`,
      uri: 'https://app.tuwa.io',
      version: '1',
      chainId: 'solana:5eykt4UsFv8P8NJdTREpY1vzqKqZKvdp',
      nonce: 'a4f3b2c1d0e5f678',
      issuedAt: '2026-08-06T08:00:00.000Z',
    });

    // 16 bytes instead of 64 bytes
    const shortSignatureBase58 = bytesToBase58(new Uint8Array(16).fill(1));

    const result = await verifyEd25519({
      message,
      signature: shortSignatureBase58,
    });

    expect(result.success).toBe(false);
    expect(result.error).toContain('Invalid Solana signature length');
  });

  it('successfully verifies a Wallet Standard solana:signIn output object', async () => {
    const keyPair = (await globalThis.crypto.subtle.generateKey('Ed25519', true, ['sign', 'verify'])) as CryptoKeyPair;

    const rawPublicKey = await globalThis.crypto.subtle.exportKey('raw', keyPair.publicKey);
    const solanaAddress = bytesToBase58(new Uint8Array(rawPublicKey));

    const message = buildMessage({
      domain: 'app.tuwa.io',
      address: `solana:5eykt4UsFv8P8NJdTREpY1vzqKqZKvdp:${solanaAddress}`,
      uri: 'https://app.tuwa.io',
      version: '1',
      chainId: 'solana:5eykt4UsFv8P8NJdTREpY1vzqKqZKvdp',
      nonce: 'a4f3b2c1d0e5f678',
      issuedAt: '2026-08-06T08:00:00.000Z',
    });

    const messageBytes = new TextEncoder().encode(message);
    const signatureBuffer = await globalThis.crypto.subtle.sign('Ed25519', keyPair.privateKey, messageBytes);

    const result = await verifyEd25519({
      account: { address: solanaAddress, publicKey: new Uint8Array(rawPublicKey) },
      signedMessage: messageBytes,
      signature: new Uint8Array(signatureBuffer),
    });

    expect(result.success).toBe(true);
    expect(result.data?.address).toBe(`solana:5eykt4UsFv8P8NJdTREpY1vzqKqZKvdp:${solanaAddress}`);
  });

  it('successfully verifies a nested output object structure', async () => {
    const keyPair = (await globalThis.crypto.subtle.generateKey('Ed25519', true, ['sign', 'verify'])) as CryptoKeyPair;
    const rawPublicKey = await globalThis.crypto.subtle.exportKey('raw', keyPair.publicKey);
    const solanaAddress = bytesToBase58(new Uint8Array(rawPublicKey));

    const message = buildMessage({
      domain: 'app.tuwa.io',
      address: `solana:5eykt4UsFv8P8NJdTREpY1vzqKqZKvdp:${solanaAddress}`,
      uri: 'https://app.tuwa.io',
      version: '1',
      chainId: 'solana:5eykt4UsFv8P8NJdTREpY1vzqKqZKvdp',
      nonce: 'a4f3b2c1d0e5f678',
      issuedAt: '2026-08-06T08:00:00.000Z',
    });

    const messageBytes = new TextEncoder().encode(message);
    const signatureBuffer = await globalThis.crypto.subtle.sign('Ed25519', keyPair.privateKey, messageBytes);

    const result = await verifyEd25519({
      output: {
        account: { address: solanaAddress },
        signedMessage: messageBytes,
        signature: new Uint8Array(signatureBuffer),
      },
    });

    expect(result.success).toBe(true);
  });
});

describe('verifyEd25519() with off-chain message v1 signatures', () => {
  async function createKey(): Promise<{ keyPair: CryptoKeyPair; solanaAddress: string }> {
    const keyPair = (await globalThis.crypto.subtle.generateKey('Ed25519', true, ['sign', 'verify'])) as CryptoKeyPair;
    const rawPublicKey = await globalThis.crypto.subtle.exportKey('raw', keyPair.publicKey);
    return { keyPair, solanaAddress: bytesToBase58(new Uint8Array(rawPublicKey)) };
  }

  function messageFor(solanaAddress: string): string {
    return buildMessage({
      domain: 'app.tuwa.io',
      address: `solana:5eykt4UsFv8P8NJdTREpY1vzqKqZKvdp:${solanaAddress}`,
      uri: 'https://app.tuwa.io',
      version: '1',
      chainId: 'solana:5eykt4UsFv8P8NJdTREpY1vzqKqZKvdp',
      nonce: 'a4f3b2c1d0e5f678',
      issuedAt: '2026-08-06T08:00:00.000Z',
    });
  }

  /** Signs `content` the way a wallet's `solana:signOffchainMessage` does: a version 1 envelope. */
  async function signOffchain(
    keyPairs: CryptoKeyPair[],
    signatories: string[],
    content: string,
  ): Promise<{ envelope: Uint8Array; signatures: Record<string, Uint8Array> }> {
    const envelope = compileOffchainMessageV1Envelope({
      version: 1,
      content,
      requiredSignatories: signatories.map((signatory) => ({ address: address(signatory) })),
    });
    const signed = await signOffchainMessageEnvelope(keyPairs, envelope);
    const signatures: Record<string, Uint8Array> = {};
    for (const [signatory, signature] of Object.entries(signed.signatures)) {
      if (signature) signatures[signatory] = signature;
    }
    return { envelope: signed.content as unknown as Uint8Array, signatures };
  }

  it('verifies a base58 signature over the off-chain message v1 envelope of the message', async () => {
    const { keyPair, solanaAddress } = await createKey();
    const message = messageFor(solanaAddress);
    const { signatures } = await signOffchain([keyPair], [solanaAddress], message);

    const result = await verifyEd25519({ message, signature: bytesToBase58(signatures[solanaAddress]) });

    expect(result.success).toBe(true);
    expect(result.data?.address).toBe(`solana:5eykt4UsFv8P8NJdTREpY1vzqKqZKvdp:${solanaAddress}`);
  });

  it('verifies an off-chain message v1 envelope passed as the signed message bytes', async () => {
    const { keyPair, solanaAddress } = await createKey();
    const message = messageFor(solanaAddress);
    const { envelope, signatures } = await signOffchain([keyPair], [solanaAddress], message);

    const result = await verifyEd25519({
      account: { address: solanaAddress },
      signedMessage: envelope,
      signature: signatures[solanaAddress],
    });

    expect(result.success).toBe(true);
    expect(result.data?.nonce).toBe('a4f3b2c1d0e5f678');
  });

  it('rejects an off-chain envelope signed by another key', async () => {
    const { solanaAddress } = await createKey();
    const other = await createKey();
    const message = messageFor(solanaAddress);
    const { signatures } = await signOffchain([other.keyPair], [other.solanaAddress], message);

    const result = await verifyEd25519({ message, signature: bytesToBase58(signatures[other.solanaAddress]) });

    expect(result.success).toBe(false);
    expect(result.error).toContain('ed25519 signature verification failed');
  });

  it('rejects an envelope whose signatory is not the address of the message', async () => {
    const { solanaAddress } = await createKey();
    const other = await createKey();
    const { envelope, signatures } = await signOffchain(
      [other.keyPair],
      [other.solanaAddress],
      messageFor(solanaAddress),
    );

    const result = await verifyEd25519({
      account: { address: other.solanaAddress },
      signedMessage: envelope,
      signature: signatures[other.solanaAddress],
    });

    expect(result.success).toBe(false);
    expect(result.error).toContain('signatory');
  });

  it('rejects an envelope with more than one required signatory', async () => {
    const { keyPair, solanaAddress } = await createKey();
    const other = await createKey();
    const { envelope, signatures } = await signOffchain(
      [keyPair, other.keyPair],
      [solanaAddress, other.solanaAddress],
      messageFor(solanaAddress),
    );

    const result = await verifyEd25519({
      account: { address: solanaAddress },
      signedMessage: envelope,
      signature: signatures[solanaAddress],
    });

    expect(result.success).toBe(false);
    expect(result.error).toContain('signatory');
  });
});
