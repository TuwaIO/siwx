import { describe, expect, it, vi } from 'vitest';

import { verifySiwxJwt } from './jwt';
import { generateSiwxJwtKey, importSiwxJwtKey } from './jwtKeys';
import { createSiwxApiHandler, createStatelessDemoSiwxHandler } from './next';
import * as serverModule from './server';
import { MemorySiwxNonceStore, MemorySiwxSessionStore } from './server';

const TEST_SECRET = '0123456789abcdef0123456789abcdef'; // 32 characters

describe('createSiwxApiHandler (Durable Profile)', () => {
  it('throws error if sessionStore or nonceStore is missing', () => {
    // @ts-expect-error test missing params
    expect(() => createSiwxApiHandler({})).toThrow('requires both `sessionStore` and `nonceStore`');
  });

  const sessionStore = new MemorySiwxSessionStore();
  const nonceStore = new MemorySiwxNonceStore();

  const handler = createSiwxApiHandler({
    sessionStore,
    nonceStore,
    cookieOptions: { name: 'siwx-test-session' },
  });

  const { GET, POST, DELETE } = handler;

  describe('GET /session', () => {
    it('returns null if no session cookie exists', async () => {
      const req = new Request('http://localhost/api/siwx/session', { method: 'GET' });
      const response = await GET(req);
      expect(response.status).toBe(200);
      const data = await response.json();
      expect(data).toBeNull();
    });

    it('returns stored session if valid session cookie exists', async () => {
      const record = await sessionStore.create({
        session: {
          address: 'eip155:1:0x123',
          chainId: 'eip155:1',
          domain: 'tuwa.io',
          nonce: '12345678',
          issuedAt: new Date().toISOString(),
        },
        ttlSeconds: 300,
      });

      const req = new Request('http://localhost/api/siwx/session', {
        method: 'GET',
        headers: { Cookie: `siwx-test-session=${record.id}` },
      });
      const response = await GET(req);
      expect(response.status).toBe(200);
      const data = await response.json();
      expect(data?.address).toBe('eip155:1:0x123');
    });
  });

  describe('POST /nonce', () => {
    it('generates and registers a nonce in nonceStore', async () => {
      const req = new Request('http://localhost/api/siwx/nonce', { method: 'POST' });
      const response = await POST(req);
      expect(response.status).toBe(200);
      const data = await response.json();
      expect(data.nonce).toHaveLength(32);

      // Verify that the issued nonce can be consumed once
      const consumed = await nonceStore.consume({ nonce: data.nonce });
      expect(consumed).toBe(true);
    });
  });

  describe('POST /verify', () => {
    it('returns 400 if message or signature is missing', async () => {
      const req = new Request('http://localhost/api/siwx/verify', {
        method: 'POST',
        body: JSON.stringify({ message: 'only-msg' }),
      });
      const response = await POST(req);
      expect(response.status).toBe(400);
    });

    it('returns 401 if payload verification fails', async () => {
      vi.spyOn(serverModule, 'verifySiwxPayload').mockResolvedValueOnce({
        success: false,
        error: 'Signature invalid',
      });

      const req = new Request('http://localhost/api/siwx/verify', {
        method: 'POST',
        body: JSON.stringify({ message: 'msg', signature: 'sig' }),
      });
      const response = await POST(req);
      expect(response.status).toBe(401);
    });

    it('returns 401 if nonce replay is detected (consume returns false)', async () => {
      const mockParsed = {
        nonce: 'replayed_nonce',
        address: 'eip155:1:0x123',
        chainId: 'eip155:1' as const,
        domain: 'tuwa.io',
        uri: 'https://tuwa.io',
        version: '1' as const,
        issuedAt: new Date().toISOString(),
      };

      vi.spyOn(serverModule, 'verifySiwxPayload').mockResolvedValueOnce({
        success: true,
        data: mockParsed,
      });

      const req = new Request('http://localhost/api/siwx/verify', {
        method: 'POST',
        body: JSON.stringify({ message: 'msg', signature: 'sig' }),
      });
      const response = await POST(req);
      expect(response.status).toBe(401);
      const data = await response.json();
      expect(data.error).toContain('Nonce replay');
    });

    it('returns 200, saves to store, and sets HttpOnly cookie on success', async () => {
      const validNonce = 'valid_nonce_12345';
      await nonceStore.issue({ nonce: validNonce, ttlSeconds: 60 });

      const mockParsed = {
        nonce: validNonce,
        address: 'eip155:1:0x123',
        chainId: 'eip155:1' as const,
        domain: 'tuwa.io',
        uri: 'https://tuwa.io',
        version: '1' as const,
        issuedAt: new Date().toISOString(),
      };

      vi.spyOn(serverModule, 'verifySiwxPayload').mockResolvedValueOnce({
        success: true,
        data: mockParsed,
      });

      const req = new Request('http://localhost/api/siwx/verify', {
        method: 'POST',
        body: JSON.stringify({ message: 'msg', signature: 'sig' }),
      });
      const response = await POST(req);
      expect(response.status).toBe(200);

      const cookieHeader = response.headers.get('Set-Cookie');
      expect(cookieHeader).toContain('siwx-test-session=');
      expect(cookieHeader).toContain('HttpOnly');
    });

    it('keeps in the session how the signature was verified', async () => {
      const validNonce = 'method_nonce_12345';
      await nonceStore.issue({ nonce: validNonce, ttlSeconds: 60 });
      vi.spyOn(serverModule, 'verifySiwxPayload').mockResolvedValueOnce({
        success: true,
        namespace: 'eip155',
        method: 'eip1271',
        data: {
          nonce: validNonce,
          address: 'eip155:8453:0x1111111111111111111111111111111111111111',
          chainId: 'eip155:8453' as const,
          domain: 'tuwa.io',
          uri: 'https://tuwa.io',
          version: '1' as const,
          issuedAt: new Date().toISOString(),
        },
      });

      const response = await POST(
        new Request('http://localhost/api/siwx/verify', {
          method: 'POST',
          body: JSON.stringify({ message: 'msg', signature: 'sig' }),
        }),
      );
      const sessionId = /siwx-test-session=([^;]+)/.exec(response.headers.get('Set-Cookie') ?? '')?.[1];

      expect((await response.json()).verificationMethod).toBe('eip1271');
      expect((await sessionStore.get(sessionId!))?.session.verificationMethod).toBe('eip1271');
    });
  });

  describe('DELETE /session', () => {
    it('revokes session in store and clears cookie', async () => {
      const record = await sessionStore.create({
        session: {
          address: 'eip155:1:0x123',
          chainId: 'eip155:1' as const,
          domain: 'tuwa.io',
          nonce: '12345678',
          issuedAt: new Date().toISOString(),
        },
        ttlSeconds: 300,
      });

      const req = new Request('http://localhost/api/siwx/session', {
        method: 'DELETE',
        headers: { Cookie: `siwx-test-session=${record.id}` },
      });
      const response = await DELETE(req);
      expect(response.status).toBe(200);

      const clearCookie = response.headers.get('Set-Cookie');
      expect(clearCookie).toContain('Max-Age=0');

      // Verify revoked
      const fetched = await sessionStore.get(record.id);
      expect(fetched).toBeNull();
    });
  });
});

describe('createStatelessDemoSiwxHandler (Stateless Demo Profile)', () => {
  it('throws error if signingSecret is too short', () => {
    expect(() => createStatelessDemoSiwxHandler({ signingSecret: 'short' })).toThrow('at least 32 characters');
  });

  const demoHandler = createStatelessDemoSiwxHandler({
    signingSecret: TEST_SECRET,
    cookieOptions: { name: 'siwx-demo-session' },
  });

  const { GET, POST, DELETE } = demoHandler;

  it('handles full demo sign-in and session retrieval flow without DB/Redis', async () => {
    const nonceRes = await GET(new Request('http://localhost/api/siwx/nonce', { method: 'GET' }));
    const { nonce } = (await nonceRes.json()) as { nonce: string };

    const mockParsed = {
      nonce,
      address: 'eip155:1:0xDemoAccount',
      chainId: 'eip155:1' as const,
      domain: 'tuwa.io',
      uri: 'https://tuwa.io',
      version: '1' as const,
      issuedAt: new Date().toISOString(),
      expirationTime: new Date(Date.now() + 1800 * 1000).toISOString(),
    };

    vi.spyOn(serverModule, 'verifySiwxPayload').mockResolvedValueOnce({
      success: true,
      data: mockParsed,
    });

    const verifyReq = new Request('http://localhost/api/siwx/verify', {
      method: 'POST',
      body: JSON.stringify({ message: 'msg', signature: 'sig' }),
    });
    const verifyRes = await POST(verifyReq);
    expect(verifyRes.status).toBe(200);

    const setCookie = verifyRes.headers.get('Set-Cookie');
    expect(setCookie).toContain('siwx-demo-session=');
    expect(setCookie).toContain('HttpOnly');

    const tokenMatch = setCookie?.match(/siwx-demo-session=([^;]+)/);
    const token = tokenMatch?.[1];
    expect(token).toBeTruthy();

    // Now call GET /session with that token
    const sessionReq = new Request('http://localhost/api/siwx/session', {
      method: 'GET',
      headers: { Cookie: `siwx-demo-session=${token}` },
    });
    const sessionRes = await GET(sessionReq);
    expect(sessionRes.status).toBe(200);
    const sessionData = await sessionRes.json();
    expect(sessionData?.address).toBe('eip155:1:0xDemoAccount');

    // Now call DELETE /session
    const logoutReq = new Request('http://localhost/api/siwx/session', { method: 'DELETE' });
    const logoutRes = await DELETE(logoutReq);
    expect(logoutRes.status).toBe(200);
    expect(logoutRes.headers.get('Set-Cookie')).toContain('Max-Age=0');
  });

  it('issues signed nonces and rejects nonces it did not issue', async () => {
    const nonceRes = await GET(new Request('http://localhost/api/siwx/nonce', { method: 'GET' }));
    const { nonce } = (await nonceRes.json()) as { nonce: string };
    expect(await serverModule.verifyStatelessDemoNonce(nonce, TEST_SECRET)).toBe(true);

    vi.spyOn(serverModule, 'verifySiwxPayload').mockResolvedValueOnce({
      success: true,
      data: {
        nonce: 'a4f3b2c1d0e5f6789abc0123456789ab', // generated by a client, not by /nonce
        address: 'eip155:1:0xDemoAccount',
        chainId: 'eip155:1',
        domain: 'tuwa.io',
        uri: 'https://tuwa.io',
        version: '1',
        issuedAt: new Date().toISOString(),
      },
    });

    const res = await POST(
      new Request('http://localhost/api/siwx/verify', {
        method: 'POST',
        body: JSON.stringify({ message: 'msg', signature: 'sig' }),
      }),
    );
    expect(res.status).toBe(401);
    expect(res.headers.get('Set-Cookie')).toBeNull();
  });

  it('accepts an issued nonce only once', async () => {
    const nonceRes = await GET(new Request('http://localhost/api/siwx/nonce', { method: 'GET' }));
    const { nonce } = (await nonceRes.json()) as { nonce: string };
    const parsed = {
      nonce,
      address: 'eip155:1:0xDemoAccount',
      chainId: 'eip155:1' as const,
      domain: 'tuwa.io',
      uri: 'https://tuwa.io',
      version: '1' as const,
      issuedAt: new Date().toISOString(),
    };
    const verify = () =>
      POST(
        new Request('http://localhost/api/siwx/verify', {
          method: 'POST',
          body: JSON.stringify({ message: 'msg', signature: 'sig' }),
        }),
      );

    vi.spyOn(serverModule, 'verifySiwxPayload').mockResolvedValueOnce({ success: true, data: parsed });
    expect((await verify()).status).toBe(200);

    vi.spyOn(serverModule, 'verifySiwxPayload').mockResolvedValueOnce({ success: true, data: parsed });
    const replay = await verify();
    expect(replay.status).toBe(401);
    expect(((await replay.json()) as { error: string }).error).toContain('Nonce replay');
  });
});

describe('createSiwxApiHandler (JWT routes)', () => {
  const ISSUER = 'https://app.example.com';
  const session = {
    address: 'eip155:8453:0xAbC0000000000000000000000000000000000001',
    chainId: 'eip155:8453',
    domain: 'app.example.com',
    nonce: 'n1234567',
    issuedAt: new Date().toISOString(),
  };

  async function setup(jwt: Partial<Parameters<typeof createSiwxApiHandler>[0]['jwt']> = {}) {
    const sessionStore = new MemorySiwxSessionStore();
    const nonceStore = new MemorySiwxNonceStore();
    const signingKey = await importSiwxJwtKey({ privateKey: (await generateSiwxJwtKey()).privateJwk });
    const handler = createSiwxApiHandler({
      sessionStore,
      nonceStore,
      cookieOptions: { name: 'siwx-jwt-test' },
      jwt: { signingKey, issuer: ISSUER, ...jwt },
    });
    return { handler, sessionStore, nonceStore, signingKey };
  }

  const get = (path: string, cookie?: string) =>
    new Request(`http://localhost/api/siwx/${path}`, {
      method: 'GET',
      headers: cookie ? { Cookie: `siwx-jwt-test=${cookie}` } : {},
    });

  it('returns 404 for /token and /jwks without the jwt option', async () => {
    const { GET } = createSiwxApiHandler({
      sessionStore: new MemorySiwxSessionStore(),
      nonceStore: new MemorySiwxNonceStore(),
    });
    expect((await GET(get('token'))).status).toBe(404);
    expect((await GET(get('jwks'))).status).toBe(404);
  });

  it('returns 401 from /token without a cookie, with an unknown session and with an expired session', async () => {
    const { handler, sessionStore } = await setup();
    const expiredRecord = await sessionStore.create({ session, ttlSeconds: 0 });
    const expiredMessage = await sessionStore.create({
      session: { ...session, expirationTime: new Date(Date.now() - 1000).toISOString() },
      ttlSeconds: 300,
    });

    for (const cookie of [undefined, 'unknown-session-id', expiredRecord.id, expiredMessage.id]) {
      const response = await handler.GET(get('token', cookie));
      expect(response.status).toBe(401);
      expect((await response.json()).error).toBeTruthy();
    }
  });

  it('issues a token for the session that verifySiwxJwt accepts with the /jwks response', async () => {
    const { handler, nonceStore } = await setup({ audience: 'cdp' });
    const nonce = 'jwt_flow_nonce_1';
    await nonceStore.issue({ nonce, ttlSeconds: 60 });
    vi.spyOn(serverModule, 'verifySiwxPayload').mockResolvedValueOnce({
      success: true,
      namespace: 'eip155',
      method: 'eip191',
      data: {
        ...session,
        chainId: 'eip155:8453' as const,
        nonce,
        uri: 'https://app.example.com',
        version: '1' as const,
      },
    });
    const verifyResponse = await handler.POST(
      new Request('http://localhost/api/siwx/verify', {
        method: 'POST',
        body: JSON.stringify({ message: 'msg', signature: 'sig' }),
      }),
    );
    const sessionId = /siwx-jwt-test=([^;]+)/.exec(verifyResponse.headers.get('Set-Cookie') ?? '')?.[1];

    const tokenResponse = await handler.GET(get('token', sessionId));
    const jwksResponse = await handler.GET(get('jwks'));
    const { token, expiresAt } = await tokenResponse.json();
    const jwks = await jwksResponse.json();

    expect(tokenResponse.status).toBe(200);
    expect(tokenResponse.headers.get('Cache-Control')).toBe('no-store');
    expect(jwksResponse.headers.get('Cache-Control')).toBe('public, max-age=300');
    expect(expiresAt).toBeGreaterThan(Date.now());
    expect(await verifySiwxJwt(token, { jwks, issuer: ISSUER, audience: 'cdp' })).toMatchObject({
      sub: 'eip155:0xabc0000000000000000000000000000000000001',
      caip10: session.address,
    });
  });

  it('binds the subject to the chain for a session that does not say how it was verified', async () => {
    const { handler, sessionStore } = await setup();
    const record = await sessionStore.create({ session, ttlSeconds: 300 });

    const { token } = await (await handler.GET(get('token', record.id))).json();
    const jwks = await (await handler.GET(get('jwks'))).json();

    expect((await verifySiwxJwt(token, { jwks, issuer: ISSUER }))?.sub).toBe(
      'eip155:8453:0xabc0000000000000000000000000000000000001',
    );
  });

  it('uses bindSubject, jwt.subject and jwt.claims', async () => {
    const bound = await setup();
    const record = await bound.sessionStore.create({ session, ttlSeconds: 300 });
    await bound.sessionStore.bindSubject(record.id, 'user_42');
    const { token: boundToken } = await (await bound.handler.GET(get('token', record.id))).json();
    const boundJwks = await (await bound.handler.GET(get('jwks'))).json();
    expect((await verifySiwxJwt(boundToken, { jwks: boundJwks, issuer: ISSUER }))?.sub).toBe('user_42');

    const custom = await setup({
      subject: (r) => `custom:${r.session.domain}`,
      claims: async () => ({ role: 'member' }),
    });
    const customRecord = await custom.sessionStore.create({ session, ttlSeconds: 300 });
    const { token } = await (await custom.handler.GET(get('token', customRecord.id))).json();
    const jwks = await (await custom.handler.GET(get('jwks'))).json();
    expect(await verifySiwxJwt(token, { jwks, issuer: ISSUER })).toMatchObject({
      sub: 'custom:app.example.com',
      role: 'member',
    });
  });

  it('caps exp by the record expiry', async () => {
    const { handler, sessionStore } = await setup({ ttlSeconds: 3600 });
    const record = await sessionStore.create({ session, ttlSeconds: 120 });
    const { expiresAt } = await (await handler.GET(get('token', record.id))).json();
    expect(expiresAt).toBeLessThanOrEqual(record.expiresAt);
  });

  it('accepts signingKey as a promise and publishes previousKeys', async () => {
    const previous = await generateSiwxJwtKey('RS256');
    const signingKey = importSiwxJwtKey({ privateKey: (await generateSiwxJwtKey()).privateJwk });
    const { GET } = createSiwxApiHandler({
      sessionStore: new MemorySiwxSessionStore(),
      nonceStore: new MemorySiwxNonceStore(),
      jwt: { signingKey, previousKeys: [previous.publicJwk], issuer: ISSUER },
    });
    const jwks = await (await GET(get('jwks'))).json();
    expect(jwks.keys.map((key: { kid: string }) => key.kid)).toEqual([(await signingKey).kid, previous.kid]);
  });

  it('throws on an empty issuer and ttlSeconds 0', async () => {
    const signingKey = await importSiwxJwtKey({ privateKey: (await generateSiwxJwtKey()).privateJwk });
    const stores = { sessionStore: new MemorySiwxSessionStore(), nonceStore: new MemorySiwxNonceStore() };
    expect(() => createSiwxApiHandler({ ...stores, jwt: { signingKey, issuer: '' } })).toThrow(TypeError);
    expect(() => createSiwxApiHandler({ ...stores, jwt: { signingKey, issuer: ISSUER, ttlSeconds: 0 } })).toThrow(
      RangeError,
    );
  });
});
