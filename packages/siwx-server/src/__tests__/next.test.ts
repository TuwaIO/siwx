import { describe, expect, it, vi } from 'vitest';

import { createSiwxApiHandler, createStatelessDemoSiwxHandler } from '../next';
import * as serverModule from '../server';
import { MemorySiwxNonceStore, MemorySiwxSessionStore } from '../server';

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
    const mockParsed = {
      nonce: 'demo_nonce_123',
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
});
