import { buildMessage, type SiwxChainId } from '@tuwaio/siwx-core';
import { generatePrivateKey, privateKeyToAccount } from 'viem/accounts';
import { describe, expect, it } from 'vitest';

import { type SiwxJwks, verifySiwxJwt } from './index';
import { generateSiwxJwtKey, importSiwxJwtKey } from './jwtKeys';
import { createSiwxApiHandler } from './next';
import { MemorySiwxNonceStore, MemorySiwxSessionStore } from './server';

const BASE = 'https://app.example.com/api/siwx';
const ISSUER = 'https://app.example.com';
const MAINNET = 'solana:5eykt4UsFv8P8NJdTREpY1vzqKqZKvdp';
const DEVNET = 'solana:EtWTRABZaYq6iMfeYKouRu166VU2xqa1';

const handler = createSiwxApiHandler({
  sessionStore: new MemorySiwxSessionStore(),
  nonceStore: new MemorySiwxNonceStore(),
  policy: { expectedDomain: 'app.example.com' },
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

/** Signs in through the handler like a browser would, then asks `/token` for a JWT and checks it against `/jwks`. */
async function jwtFor(account: { address: string; chainId: SiwxChainId }, sign: (message: string) => Promise<string>) {
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
  const cookie = verified.headers.get('set-cookie')!.split(';')[0];

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
    const keys = (await globalThis.crypto.subtle.generateKey('Ed25519', true, ['sign', 'verify'])) as CryptoKeyPair;
    const address = toBase58(new Uint8Array(await globalThis.crypto.subtle.exportKey('raw', keys.publicKey)));
    const sign = async (message: string) =>
      toBase58(
        new Uint8Array(
          await globalThis.crypto.subtle.sign('Ed25519', keys.privateKey, new TextEncoder().encode(message)),
        ),
      );

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
});
