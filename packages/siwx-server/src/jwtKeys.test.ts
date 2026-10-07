import { generateKeyPairSync } from 'node:crypto';

import { describe, expect, it } from 'vitest';

import { createSiwxJwks, generateSiwxJwtKey, importSiwxJwtKey, siwxJwkThumbprint } from './jwtKeys';

const PRIVATE_MEMBERS = ['d', 'p', 'q', 'dp', 'dq', 'qi'] as const;

/** RSA public key of RFC 7638 §3.1 and its thumbprint. */
const RFC7638_KEY = {
  kty: 'RSA',
  n: '0vx7agoebGcQSuuPiLJXZptN9nndrQmbXEps2aiAFbWhM78LhWx4cbbfAAtVT86zwu1RK7aPFFxuhDR1L6tSoc_BJECPebWKRXjBZCiFV4n3oknjhMstn64tZ_2W-5JsGY4Hc5n9yBXArwl93lqt7_RN5w6Cf0h4QyQ5v-65YGjQR0_FDW2QvzqY368QQMicAtaSqzs8KJZgnYb9c7d0zgdAZHzu6qMQvRL5hajrn1n91CbOpbISD08qNLyrdkt-bFTWhAI4vMQFh6WeZu0fM4lFd2NcRwr3XPksINHaQ-G_xBniIqbw0Ls1jF44-csFCur-kEgU8awapJzKnqDKgw',
  e: 'AQAB',
  alg: 'RS256',
  kid: '2011-04-29',
};
const RFC7638_THUMBPRINT = 'NzbLsXh8uDCcd-6MNwXF4W_7noWXFZAfHkxZsRGC9Xs';

function nodeEcKey() {
  const { privateKey } = generateKeyPairSync('ec', { namedCurve: 'P-256' });
  return {
    jwk: privateKey.export({ format: 'jwk' }) as JsonWebKey,
    pem: privateKey.export({ type: 'pkcs8', format: 'pem' }) as string,
  };
}

describe('siwxJwkThumbprint', () => {
  it('computes the RFC 7638 example thumbprint', async () => {
    expect(await siwxJwkThumbprint(RFC7638_KEY)).toBe(RFC7638_THUMBPRINT);
  });
});

describe('generateSiwxJwtKey', () => {
  it.each(['ES256', 'RS256'] as const)('generates a %s key whose public JWK has no private members', async (alg) => {
    const { privateJwk, publicJwk, kid } = await generateSiwxJwtKey(alg);

    expect(publicJwk.alg).toBe(alg);
    expect(publicJwk.kid).toBe(kid);
    expect(publicJwk.use).toBe('sig');
    for (const member of PRIVATE_MEMBERS) {
      expect(publicJwk).not.toHaveProperty(member);
    }
    expect(privateJwk.d).toBeTruthy();
    expect((await importSiwxJwtKey({ privateKey: privateJwk })).kid).toBe(kid);
  });

  it('generates ES256 by default and RSA keys of at least 2048 bits', async () => {
    expect((await generateSiwxJwtKey()).publicJwk.kty).toBe('EC');
    const { publicJwk } = await generateSiwxJwtKey('RS256');
    expect(Buffer.from(publicJwk.n ?? '', 'base64url').length).toBeGreaterThanOrEqual(256);
  });
});

describe('importSiwxJwtKey', () => {
  it('imports the same key from a JWK object, a JSON string and PKCS#8 PEM with the same kid', async () => {
    const { jwk, pem } = nodeEcKey();

    const fromObject = await importSiwxJwtKey({ privateKey: jwk });
    const fromJson = await importSiwxJwtKey({ privateKey: ` ${JSON.stringify(jwk, null, 2)}\n` });
    const fromPem = await importSiwxJwtKey({ privateKey: pem });

    expect(fromObject.alg).toBe('ES256');
    expect(fromJson.kid).toBe(fromObject.kid);
    expect(fromPem.kid).toBe(fromObject.kid);
    expect(fromObject.kid).toBe(await siwxJwkThumbprint(fromObject.publicJwk));
    expect(fromObject.privateKey.extractable).toBe(false);
    expect(fromObject.privateKey.usages).toEqual(['sign']);
  });

  it('imports an RSA PEM without an explicit alg', async () => {
    const { privateKey } = generateKeyPairSync('rsa', { modulusLength: 2048 });
    const key = await importSiwxJwtKey({ privateKey: privateKey.export({ type: 'pkcs8', format: 'pem' }) as string });
    expect(key.alg).toBe('RS256');
    expect(key.publicJwk.kty).toBe('RSA');
  });

  it('imports a PEM with literal \\n and with \\r\\n line breaks', async () => {
    const { pem } = nodeEcKey();
    const expected = (await importSiwxJwtKey({ privateKey: pem })).kid;

    expect((await importSiwxJwtKey({ privateKey: pem.trim().replace(/\n/g, '\\n') })).kid).toBe(expected);
    expect((await importSiwxJwtKey({ privateKey: pem.replace(/\n/g, '\r\n') })).kid).toBe(expected);
  });

  it('strips key_ops, ext and use before importing a JWK', async () => {
    const { jwk } = nodeEcKey();
    const key = await importSiwxJwtKey({ privateKey: { ...jwk, key_ops: ['verify'], ext: false, use: 'enc' } });
    expect(key.alg).toBe('ES256');
  });

  it('rejects a public key, an unsupported curve, an alg mismatch, a short RSA key and garbage', async () => {
    const { jwk } = nodeEcKey();
    const publicOnly: JsonWebKey = { ...jwk };
    delete publicOnly.d;
    const p384 = generateKeyPairSync('ec', { namedCurve: 'P-384' }).privateKey.export({ format: 'jwk' }) as JsonWebKey;
    const rsa1024 = generateKeyPairSync('rsa', { modulusLength: 1024 }).privateKey.export({
      format: 'jwk',
    }) as JsonWebKey;

    await expect(importSiwxJwtKey({ privateKey: publicOnly })).rejects.toThrow(TypeError);
    await expect(importSiwxJwtKey({ privateKey: p384 })).rejects.toThrow(TypeError);
    await expect(importSiwxJwtKey({ privateKey: jwk, alg: 'RS256' })).rejects.toThrow(TypeError);
    await expect(importSiwxJwtKey({ privateKey: { ...jwk, alg: 'RS256' } })).rejects.toThrow(TypeError);
    await expect(importSiwxJwtKey({ privateKey: rsa1024 })).rejects.toThrow(TypeError);
    await expect(importSiwxJwtKey({ privateKey: 'not a key' })).rejects.toThrow(TypeError);
  });
});

describe('createSiwxJwks', () => {
  it('publishes public JWKs only and drops duplicate kids', async () => {
    const current = await importSiwxJwtKey({ privateKey: (await generateSiwxJwtKey()).privateJwk });
    const previous = await generateSiwxJwtKey('RS256');

    const jwks = createSiwxJwks([current, previous.publicJwk, current.publicJwk]);

    expect(jwks.keys.map((key) => key.kid)).toEqual([current.kid, previous.kid]);
    for (const key of jwks.keys) {
      for (const member of PRIVATE_MEMBERS) {
        expect(key).not.toHaveProperty(member);
      }
    }
  });
});
