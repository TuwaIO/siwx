import { buildMessage, type SiwxChainId } from '@tuwaio/siwx-core';
import type { Hex, PublicClient } from 'viem';
import { generatePrivateKey, privateKeyToAccount } from 'viem/accounts';
import { describe, expect, it } from 'vitest';

import { type SiwxJwks, type SiwxSession, verifySiwxJwt } from './index';
import { generateSiwxJwtKey, importSiwxJwtKey } from './jwtKeys';
import { createSiwxApiHandler } from './next';
import { MemorySiwxNonceStore, MemorySiwxSessionStore } from './server';

const BASE = 'https://app.example.com/api/siwx';
const ISSUER = 'https://app.example.com';
const MAINNET = 'solana:5eykt4UsFv8P8NJdTREpY1vzqKqZKvdp';
const DEVNET = 'solana:EtWTRABZaYq6iMfeYKouRu166VU2xqa1';
const CONTRACT_WALLET = '0x1111111111111111111111111111111111111111';
const CONTRACT_SIGNATURE = `0x${'ab'.repeat(65)}`;

/** A client whose `eth_call` answers like the ERC-6492 universal validator: valid only for `CONTRACT_WALLET`. */
function contractWalletClient(chainId: number): PublicClient {
  const call = async ({ data }: { data: Hex }) => ({
    data: (data.toLowerCase().includes(CONTRACT_WALLET.slice(2)) ? '0x01' : '0x00') as Hex,
  });
  return { chain: { id: chainId }, call } as unknown as PublicClient;
}

const handler = createSiwxApiHandler({
  sessionStore: new MemorySiwxSessionStore(),
  nonceStore: new MemorySiwxNonceStore(),
  policy: { expectedDomain: 'app.example.com' },
  verifyOptions: { publicClient: contractWalletClient },
  jwt: {
    signingKey: generateSiwxJwtKey().then(({ privateJwk }) => importSiwxJwtKey({ privateKey: privateJwk })),
    issuer: ISSUER,
  },
});

const BASE58 = '123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz';
function toBase58(bytes: Uint8Array): string {
  let value = BigInt(`0x${Buffer.from(bytes).toString('hex') || '0'}`);
  let out = '';
  while (value > 0n) {
    out = BASE58[Number(value % 58n)] + out;
    value /= 58n;
  }
  for (const byte of bytes) {
    if (byte !== 0) break;
    out = `1${out}`;
  }
  return out;
}

/** A Solana account with a Web Crypto Ed25519 key that signs the message text. */
async function ed25519Account() {
  const keys = (await globalThis.crypto.subtle.generateKey('Ed25519', true, ['sign', 'verify'])) as CryptoKeyPair;
  const address = toBase58(new Uint8Array(await globalThis.crypto.subtle.exportKey('raw', keys.publicKey)));
  const sign = async (message: string) =>
    toBase58(
      new Uint8Array(
        await globalThis.crypto.subtle.sign('Ed25519', keys.privateKey, new TextEncoder().encode(message)),
      ),
    );
  return { address, sign };
}

/** Signs in through the handler like a browser would and returns the session cookie and the session. */
async function signIn(account: { address: string; chainId: SiwxChainId }, sign: (message: string) => Promise<string>) {
  const { nonce } = (await (await handler.POST(new Request(`${BASE}/nonce`, { method: 'POST' }))).json()) as {
    nonce: string;
  };
  const message = buildMessage({
    domain: 'app.example.com',
    uri: 'https://app.example.com',
    version: '1',
    nonce,
    issuedAt: new Date().toISOString(),
    address: `${account.chainId}:${account.address}`,
    chainId: account.chainId,
  });
  const verified = await handler.POST(
    new Request(`${BASE}/verify`, {
      method: 'POST',
      body: JSON.stringify({ message, signature: await sign(message) }),
    }),
  );
  expect(verified.status, `sign-in on ${account.chainId}`).toBe(200);
  return { cookie: verified.headers.get('set-cookie')!.split(';')[0], session: (await verified.json()) as SiwxSession };
}

/** Signs in through the handler, then asks `/token` for a JWT and checks it against `/jwks`. */
async function jwtFor(account: { address: string; chainId: SiwxChainId }, sign: (message: string) => Promise<string>) {
  const { cookie } = await signIn(account, sign);

  const { token } = (await (await handler.GET(new Request(`${BASE}/token`, { headers: { cookie } }))).json()) as {
    token: string;
  };
  const jwks = (await (await handler.GET(new Request(`${BASE}/jwks`))).json()) as SiwxJwks;
  const claims = await verifySiwxJwt(token, { jwks, issuer: ISSUER });
  expect(claims, `JWT for ${account.chainId}`).not.toBeNull();
  return claims!;
}

describe('JWT subjects across networks', () => {
  it('signs in an EVM wallet on any network, known to viem or not, with one subject', async () => {
    const wallet = privateKeyToAccount(generatePrivateKey());
    const sign = (message: string) => wallet.signMessage({ message });
    const chains: SiwxChainId[] = ['eip155:1', 'eip155:8453', 'eip155:11155111', 'eip155:4242424242424'];

    const claims = await Promise.all(chains.map((chainId) => jwtFor({ address: wallet.address, chainId }, sign)));
    const lowercase = await jwtFor({ address: wallet.address.toLowerCase(), chainId: 'eip155:10' }, sign);

    for (const [index, claim] of claims.entries()) {
      expect(claim.sub).toBe(`eip155:${wallet.address.toLowerCase()}`);
      expect(claim.chain_id).toBe(chains[index]);
      expect(claim.caip10).toBe(`${chains[index]}:${wallet.address}`);
    }
    expect(lowercase.sub).toBe(claims[0].sub);
  });

  it('signs in a Solana wallet on every cluster and both chain ID forms, with one subject per account', async () => {
    const { address, sign } = await ed25519Account();

    const devnetByName = await jwtFor({ address, chainId: 'solana:devnet' }, sign);
    const devnetByHash = await jwtFor({ address, chainId: DEVNET }, sign);
    const mainnet = await jwtFor({ address, chainId: MAINNET }, sign);

    expect(devnetByName.sub).toBe(`solana:${address}`);
    expect(devnetByHash.sub).toBe(devnetByName.sub);
    expect(mainnet.sub).toBe(devnetByName.sub);
    expect(devnetByName.chain_id).toBe(DEVNET);
    expect(devnetByName.caip10).toBe(`${DEVNET}:${address}`);
    expect(mainnet.chain_id).toBe(MAINNET);
  });

  it('gives a smart contract wallet a subject per network, because its owners are set on each chain', async () => {
    const sign = async () => CONTRACT_SIGNATURE;

    const onMainnet = await jwtFor({ address: CONTRACT_WALLET, chainId: 'eip155:1' }, sign);
    const onBase = await jwtFor({ address: CONTRACT_WALLET, chainId: 'eip155:8453' }, sign);

    expect(onMainnet.sub).toBe(`eip155:1:${CONTRACT_WALLET}`);
    expect(onBase.sub).toBe(`eip155:8453:${CONTRACT_WALLET}`);
    expect(onBase.caip10).toBe(`eip155:8453:${CONTRACT_WALLET}`);
    expect(onBase.chain_id).toBe('eip155:8453');
  });

  it('keeps in the session how each wallet signed in', async () => {
    const wallet = privateKeyToAccount(generatePrivateKey());
    const solana = await ed25519Account();

    const eoa = await signIn({ address: wallet.address, chainId: 'eip155:1' }, (message) =>
      wallet.signMessage({ message }),
    );
    const contract = await signIn({ address: CONTRACT_WALLET, chainId: 'eip155:1' }, async () => CONTRACT_SIGNATURE);
    const ed25519 = await signIn({ address: solana.address, chainId: MAINNET }, solana.sign);

    expect(eoa.session.verificationMethod).toBe('eip191');
    expect(contract.session.verificationMethod).toBe('eip1271');
    expect(ed25519.session.verificationMethod).toBe('ed25519');
  });
});

describe('Solana sign-in with an off-chain message signature', () => {
  /** The version 1 off-chain message of `text` with one signer, built by hand from the specification. */
  function offchainMessageV1(publicKey: Uint8Array, text: string): Uint8Array<ArrayBuffer> {
    const signingDomain = [0xff, ...new TextEncoder().encode('solana offchain')];
    return new Uint8Array([...signingDomain, 1, 1, ...publicKey, ...new TextEncoder().encode(text)]);
  }

  async function hardwareWalletAccount() {
    const keys = (await globalThis.crypto.subtle.generateKey('Ed25519', true, ['sign', 'verify'])) as CryptoKeyPair;
    const publicKey = new Uint8Array(await globalThis.crypto.subtle.exportKey('raw', keys.publicKey));
    const sign = async (message: string) =>
      toBase58(
        new Uint8Array(
          await globalThis.crypto.subtle.sign('Ed25519', keys.privateKey, offchainMessageV1(publicKey, message)),
        ),
      );
    return { address: toBase58(publicKey), sign };
  }

  it('signs in and issues the same JWT subject as a plain message signature', async () => {
    const account = await hardwareWalletAccount();

    const claims = await jwtFor({ address: account.address, chainId: MAINNET }, account.sign);

    expect(claims.sub).toBe(`solana:${account.address}`);
    expect(claims.caip10).toBe(`${MAINNET}:${account.address}`);
  });

  it('rejects the same off-chain signature twice, because the nonce is spent', async () => {
    const account = await hardwareWalletAccount();
    const { nonce } = (await (await handler.POST(new Request(`${BASE}/nonce`, { method: 'POST' }))).json()) as {
      nonce: string;
    };
    const message = buildMessage({
      domain: 'app.example.com',
      uri: 'https://app.example.com',
      version: '1',
      nonce,
      issuedAt: new Date().toISOString(),
      address: `${MAINNET}:${account.address}`,
      chainId: MAINNET,
    });
    const body = JSON.stringify({ message, signature: await account.sign(message) });

    const first = await handler.POST(new Request(`${BASE}/verify`, { method: 'POST', body }));
    const replay = await handler.POST(new Request(`${BASE}/verify`, { method: 'POST', body }));

    expect(first.status).toBe(200);
    expect(replay.status).not.toBe(200);
  });

  it('rejects an off-chain signature of a message for another domain', async () => {
    const account = await hardwareWalletAccount();
    const { nonce } = (await (await handler.POST(new Request(`${BASE}/nonce`, { method: 'POST' }))).json()) as {
      nonce: string;
    };
    const message = buildMessage({
      domain: 'phishing.example.net',
      uri: 'https://phishing.example.net',
      version: '1',
      nonce,
      issuedAt: new Date().toISOString(),
      address: `${MAINNET}:${account.address}`,
      chainId: MAINNET,
    });

    const response = await handler.POST(
      new Request(`${BASE}/verify`, {
        method: 'POST',
        body: JSON.stringify({ message, signature: await account.sign(message) }),
      }),
    );

    expect(response.status).not.toBe(200);
  });
});
