import { createPublicKey, verify as nodeVerify } from 'node:crypto';

import { describe, expect, it } from 'vitest';

import { signSiwxJwt, siwxJwtSubject, verifySiwxJwt } from './jwt';
import { createSiwxJwks, generateSiwxJwtKey, importSiwxJwtKey } from './jwtKeys';
import type { SiwxJwtAlgorithm, SiwxJwtKey, SiwxSession } from './types';

const NOW = Date.UTC(2026, 9, 7, 12, 0, 0);
const ISSUER = 'https://app.example.com';

const evmSession: SiwxSession = {
  address: 'eip155:8453:0xAbC0000000000000000000000000000000000001',
  chainId: 'eip155:8453',
  domain: 'app.example.com',
  nonce: 'n1234567',
  issuedAt: new Date(NOW - 1000).toISOString(),
  verificationMethod: 'eip191',
};

const SOLANA_ADDRESS = '7EcDhSYGxXyscszYEp35KHN8vvw3svAuLKTzXwCFLtV';
const solanaDevnetSession: SiwxSession = {
  address: `solana:devnet:${SOLANA_ADDRESS}`,
  chainId: 'solana:devnet',
  domain: 'app.example.com',
  nonce: 'n1234567',
  issuedAt: new Date(NOW - 1000).toISOString(),
};

async function keyFor(alg: SiwxJwtAlgorithm): Promise<SiwxJwtKey> {
  return importSiwxJwtKey({ privateKey: (await generateSiwxJwtKey(alg)).privateJwk });
}

function decodePart(part: string): Record<string, unknown> {
  return JSON.parse(Buffer.from(part, 'base64url').toString('utf8')) as Record<string, unknown>;
}

describe('siwxJwtSubject', () => {
  it('builds a stable subject across EVM chains', () => {
    const onBase = siwxJwtSubject(evmSession);
    const onMainnet = siwxJwtSubject({
      ...evmSession,
      address: 'eip155:1:0xabc0000000000000000000000000000000000001',
      chainId: 'eip155:1',
    });
    expect(onBase).toBe('eip155:0xabc0000000000000000000000000000000000001');
    expect(onMainnet).toBe(onBase);
  });

  it('builds a stable subject for old and genesis-hash Solana chain IDs', () => {
    const genesis = siwxJwtSubject({
      ...solanaDevnetSession,
      address: `solana:EtWTRABZaYq6iMfeYKouRu166VU2xqa1:${SOLANA_ADDRESS}`,
      chainId: 'solana:EtWTRABZaYq6iMfeYKouRu166VU2xqa1',
    });
    expect(siwxJwtSubject(solanaDevnetSession)).toBe(`solana:${SOLANA_ADDRESS}`);
    expect(genesis).toBe(`solana:${SOLANA_ADDRESS}`);
  });

  it('throws TypeError for a session whose address is not a CAIP-10 account ID', async () => {
    const broken = { ...evmSession, address: 'eip155:8453:0x1234' };
    expect(() => siwxJwtSubject(broken)).toThrow(TypeError);
    await expect(
      signSiwxJwt({ session: broken, key: await keyFor('ES256'), issuer: ISSUER, now: NOW }),
    ).rejects.toThrow(TypeError);
  });

  it('prefers subjectId', () => {
    expect(siwxJwtSubject(evmSession, 'user_42')).toBe('user_42');
    expect(siwxJwtSubject(evmSession, '')).toBe('eip155:0xabc0000000000000000000000000000000000001');
  });

  it('binds the subject of a smart contract wallet to its chain', () => {
    const contractOnBase: SiwxSession = { ...evmSession, verificationMethod: 'eip1271' };
    const contractOnMainnet: SiwxSession = {
      ...contractOnBase,
      address: 'eip155:1:0xAbC0000000000000000000000000000000000001',
      chainId: 'eip155:1',
    };
    expect(siwxJwtSubject(contractOnBase)).toBe('eip155:8453:0xabc0000000000000000000000000000000000001');
    expect(siwxJwtSubject({ ...evmSession, verificationMethod: 'erc6492' })).toBe(siwxJwtSubject(contractOnBase));
    expect(siwxJwtSubject(contractOnMainnet)).toBe('eip155:1:0xabc0000000000000000000000000000000000001');
  });

  it('binds the subject to the chain when the session does not say how it was verified', () => {
    expect(siwxJwtSubject({ ...evmSession, verificationMethod: undefined })).toBe(
      'eip155:8453:0xabc0000000000000000000000000000000000001',
    );
  });

  it('prefers subjectId for smart contract wallets too', () => {
    expect(siwxJwtSubject({ ...evmSession, verificationMethod: 'eip1271' }, 'user_42')).toBe('user_42');
  });
});

describe('signSiwxJwt', () => {
  it.each(['ES256', 'RS256'] as const)('signs a %s token that node:crypto verifies', async (alg) => {
    const key = await keyFor(alg);
    const { token } = await signSiwxJwt({ session: evmSession, key, issuer: ISSUER, now: NOW });
    const [header, payload, signature] = token.split('.');

    expect(decodePart(header)).toEqual({ alg, kid: key.kid, typ: 'JWT' });
    const publicKey = createPublicKey({ key: key.publicJwk as JsonWebKey, format: 'jwk' });
    const data = Buffer.from(`${header}.${payload}`);
    const sig = Buffer.from(signature, 'base64url');
    const valid =
      alg === 'ES256'
        ? nodeVerify('sha256', data, { key: publicKey, dsaEncoding: 'ieee-p1363' }, sig)
        : nodeVerify('sha256', data, publicKey, sig);
    expect(valid).toBe(true);
  });

  it('writes iss, sub, aud, iat, exp, jti, caip10 and chain_id', async () => {
    const key = await keyFor('ES256');
    const first = await signSiwxJwt({
      session: solanaDevnetSession,
      key,
      issuer: ISSUER,
      audience: ['a', 'b'],
      now: NOW,
    });
    const second = await signSiwxJwt({ session: solanaDevnetSession, key, issuer: ISSUER, now: NOW });
    const payload = decodePart(first.token.split('.')[1]);

    expect(payload).toMatchObject({
      iss: ISSUER,
      sub: `solana:${SOLANA_ADDRESS}`,
      aud: ['a', 'b'],
      iat: NOW / 1000,
      exp: NOW / 1000 + 600,
      caip10: `solana:EtWTRABZaYq6iMfeYKouRu166VU2xqa1:${SOLANA_ADDRESS}`,
      chain_id: 'solana:EtWTRABZaYq6iMfeYKouRu166VU2xqa1',
    });
    expect(first.expiresAt).toBe(NOW + 600_000);
    expect(typeof payload.jti).toBe('string');
    expect(payload.jti).not.toBe(decodePart(second.token.split('.')[1]).jti);
    expect(decodePart(second.token.split('.')[1])).not.toHaveProperty('aud');
  });

  it('caps exp by notAfter and by the message expirationTime', async () => {
    const key = await keyFor('ES256');
    const byNotAfter = await signSiwxJwt({
      session: evmSession,
      key,
      issuer: ISSUER,
      notAfter: NOW + 90_500,
      now: NOW,
    });
    const byMessage = await signSiwxJwt({
      session: { ...evmSession, expirationTime: new Date(NOW + 30_000).toISOString() },
      key,
      issuer: ISSUER,
      now: NOW,
    });
    expect(decodePart(byNotAfter.token.split('.')[1]).exp).toBe(NOW / 1000 + 90);
    expect(byMessage.expiresAt).toBe(NOW + 30_000);
  });

  it('throws RangeError when the session already expired', async () => {
    const key = await keyFor('ES256');
    await expect(
      signSiwxJwt({ session: evmSession, key, issuer: ISSUER, notAfter: NOW - 1, now: NOW }),
    ).rejects.toThrow(RangeError);
    await expect(
      signSiwxJwt({
        session: { ...evmSession, expirationTime: new Date(NOW + 400).toISOString() },
        key,
        issuer: ISSUER,
        now: NOW,
      }),
    ).rejects.toThrow(RangeError);
  });

  it('rejects ttlSeconds 0, -1 and 604801, accepts 604800', async () => {
    const key = await keyFor('ES256');
    for (const ttlSeconds of [0, -1, 604_801, Number.NaN]) {
      await expect(signSiwxJwt({ session: evmSession, key, issuer: ISSUER, ttlSeconds, now: NOW })).rejects.toThrow(
        RangeError,
      );
    }
    const week = await signSiwxJwt({ session: evmSession, key, issuer: ISSUER, ttlSeconds: 604_800, now: NOW });
    expect(week.expiresAt).toBe(NOW + 604_800_000);
  });

  it('rejects an empty issuer and reserved claims, merges custom claims', async () => {
    const key = await keyFor('ES256');
    await expect(signSiwxJwt({ session: evmSession, key, issuer: '', now: NOW })).rejects.toThrow(TypeError);
    await expect(
      signSiwxJwt({ session: evmSession, key, issuer: ISSUER, claims: { sub: 'someone-else' }, now: NOW }),
    ).rejects.toThrow(TypeError);

    const { token } = await signSiwxJwt({
      session: evmSession,
      key,
      issuer: ISSUER,
      subject: 'user_42',
      claims: { email_verified: false, role: 'member' },
      now: NOW,
    });
    expect(decodePart(token.split('.')[1])).toMatchObject({ sub: 'user_42', email_verified: false, role: 'member' });
  });
});

describe('verifySiwxJwt', () => {
  function encode(value: unknown): string {
    return Buffer.from(JSON.stringify(value)).toString('base64url');
  }

  async function issued(options: { audience?: string | string[]; alg?: SiwxJwtAlgorithm } = {}) {
    const key = await keyFor(options.alg ?? 'ES256');
    const { token } = await signSiwxJwt({
      session: evmSession,
      key,
      issuer: ISSUER,
      audience: options.audience,
      now: NOW,
    });
    return { key, token, jwks: createSiwxJwks([key]), parts: token.split('.') };
  }

  it.each(['ES256', 'RS256'] as const)('returns the claims of a valid %s token', async (alg) => {
    const { token, jwks } = await issued({ alg, audience: 'cdp' });
    const payload = await verifySiwxJwt(token, { jwks, issuer: ISSUER, audience: 'cdp', now: NOW });
    expect(payload).toMatchObject({
      iss: ISSUER,
      sub: 'eip155:0xabc0000000000000000000000000000000000001',
      aud: 'cdp',
    });
  });

  it('accepts a JWKS given as an array of keys and an audience list with one match', async () => {
    const { key, token } = await issued({ audience: ['cdp', 'other'] });
    expect(
      await verifySiwxJwt(token, { jwks: [key.publicJwk], issuer: ISSUER, audience: 'other', now: NOW }),
    ).not.toBeNull();
    expect(
      await verifySiwxJwt(token, { jwks: [key], issuer: ISSUER, audience: ['x', 'cdp'], now: NOW }),
    ).not.toBeNull();
  });

  it('returns null for a tampered payload and a tampered signature', async () => {
    const { parts, jwks } = await issued();
    const payload = JSON.parse(Buffer.from(parts[1], 'base64url').toString()) as Record<string, unknown>;
    const forgedPayload = `${parts[0]}.${encode({ ...payload, sub: 'eip155:0xattacker' })}.${parts[2]}`;
    const flipped = parts[2][5] === 'A' ? 'B' : 'A';
    const forgedSignature = `${parts[0]}.${parts[1]}.${parts[2].slice(0, 5)}${flipped}${parts[2].slice(6)}`;

    expect(await verifySiwxJwt(forgedPayload, { jwks, issuer: ISSUER, now: NOW })).toBeNull();
    expect(await verifySiwxJwt(forgedSignature, { jwks, issuer: ISSUER, now: NOW })).toBeNull();
  });

  it('returns null for alg none, an alg that does not match the key, no kid and an unknown kid', async () => {
    const { key, parts, jwks } = await issued();
    const other = await keyFor('ES256');

    const none = `${encode({ alg: 'none', kid: key.kid, typ: 'JWT' })}.${parts[1]}.`;
    const wrongAlg = `${encode({ alg: 'RS256', kid: key.kid, typ: 'JWT' })}.${parts[1]}.${parts[2]}`;
    const noKid = `${encode({ alg: 'ES256', typ: 'JWT' })}.${parts[1]}.${parts[2]}`;

    expect(await verifySiwxJwt(none, { jwks, issuer: ISSUER, now: NOW })).toBeNull();
    expect(await verifySiwxJwt(wrongAlg, { jwks, issuer: ISSUER, now: NOW })).toBeNull();
    expect(await verifySiwxJwt(noKid, { jwks, issuer: ISSUER, now: NOW })).toBeNull();
    expect(
      await verifySiwxJwt(parts.join('.'), { jwks: createSiwxJwks([other]), issuer: ISSUER, now: NOW }),
    ).toBeNull();
  });

  it('returns null for another issuer, another audience and a missing required audience', async () => {
    const plain = await issued();
    const withAud = await issued({ audience: 'cdp' });

    expect(await verifySiwxJwt(plain.token, { jwks: plain.jwks, issuer: 'https://evil.example', now: NOW })).toBeNull();
    expect(
      await verifySiwxJwt(withAud.token, { jwks: withAud.jwks, issuer: ISSUER, audience: 'other', now: NOW }),
    ).toBeNull();
    expect(
      await verifySiwxJwt(plain.token, { jwks: plain.jwks, issuer: ISSUER, audience: 'cdp', now: NOW }),
    ).toBeNull();
  });

  it('returns null for an expired token and a token issued in the future, outside clockSkewSeconds', async () => {
    const { token, jwks } = await issued();
    const exp = NOW + 600_000;

    expect(await verifySiwxJwt(token, { jwks, issuer: ISSUER, now: exp + 61_000 })).toBeNull();
    expect(await verifySiwxJwt(token, { jwks, issuer: ISSUER, now: exp + 1_000, clockSkewSeconds: 0 })).toBeNull();
    expect(await verifySiwxJwt(token, { jwks, issuer: ISSUER, now: NOW - 61_000 })).toBeNull();
  });

  it('accepts a token within clockSkewSeconds after exp', async () => {
    const { token, jwks } = await issued();
    expect(await verifySiwxJwt(token, { jwks, issuer: ISSUER, now: NOW + 600_000 + 30_000 })).not.toBeNull();
  });

  it('returns null for malformed tokens without throwing', async () => {
    const { parts, jwks } = await issued();
    const malformed = [
      '',
      'a.b',
      'a.b.c.d',
      '%%%.***.###',
      `${parts[0]}.${Buffer.from('hello').toString('base64url')}.${parts[2]}`,
      `${encode('just a string')}.${parts[1]}.${parts[2]}`,
    ];
    for (const token of malformed) {
      expect(await verifySiwxJwt(token, { jwks, issuer: ISSUER, now: NOW })).toBeNull();
    }
  });

  it('verifies a token signed by a rotated key through createSiwxJwks([newKey, oldKey.publicJwk])', async () => {
    const oldKey = await keyFor('ES256');
    const newKey = await keyFor('RS256');
    const { token } = await signSiwxJwt({ session: evmSession, key: oldKey, issuer: ISSUER, now: NOW });

    const rotated = createSiwxJwks([newKey, oldKey.publicJwk]);
    expect(await verifySiwxJwt(token, { jwks: rotated, issuer: ISSUER, now: NOW })).not.toBeNull();
    expect(await verifySiwxJwt(token, { jwks: createSiwxJwks([newKey]), issuer: ISSUER, now: NOW })).toBeNull();
  });
});
