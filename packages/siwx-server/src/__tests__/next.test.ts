import { describe, expect, it, vi } from 'vitest';

import { createSiwxApiHandler } from '../next';
import * as serverModule from '../server';

vi.mock('../server', async (importOriginal) => {
  const actual = await importOriginal<typeof import('../server')>();
  return {
    ...actual,
    verifySiwxPayload: vi.fn(),
    serializeCookieSession: vi.fn(),
    deserializeCookieSession: vi.fn(),
    toSession: vi.fn(),
  };
});

describe('createSiwxApiHandler', () => {
  const handler = createSiwxApiHandler({
    cookieOptions: { name: 'test-cookie' },
  });

  const { GET, POST, DELETE } = handler;

  describe('GET /session', () => {
    it('returns null if no session cookie exists', async () => {
      const req = new Request('http://localhost/api/siwx/session', {
        method: 'GET',
      });
      const response = await GET(req);
      expect(response.status).toBe(200);
      const data = await response.json();
      expect(data).toBeNull();
    });

    it('returns deserialized session if cookie exists', async () => {
      const mockSession = { address: '0x123', chainId: 'eip155:1' };
      vi.mocked(serverModule.deserializeCookieSession).mockReturnValueOnce(mockSession as any);

      const req = new Request('http://localhost/api/siwx/session', {
        method: 'GET',
        headers: { Cookie: 'test-cookie=mock_value' },
      });
      const response = await GET(req);
      expect(response.status).toBe(200);
      const data = await response.json();
      expect(data).toEqual(mockSession);
      expect(serverModule.deserializeCookieSession).toHaveBeenCalledWith('mock_value');
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

    it('returns 401 if verification fails', async () => {
      vi.mocked(serverModule.verifySiwxPayload).mockResolvedValueOnce({
        success: false,
        error: 'Invalid signature',
      });

      const req = new Request('http://localhost/api/siwx/verify', {
        method: 'POST',
        body: JSON.stringify({ message: 'msg', signature: 'sig' }),
      });
      const response = await POST(req);
      expect(response.status).toBe(401);
      const data = await response.json();
      expect(data.error).toBe('Invalid signature');
    });

    it('returns 200 and sets cookie on successful verification', async () => {
      const mockData = { nonce: '123', address: '0x123' };
      const mockSession = { address: '0x123' };

      vi.mocked(serverModule.verifySiwxPayload).mockResolvedValueOnce({
        success: true,
        data: mockData as any,
      });
      vi.mocked(serverModule.toSession).mockReturnValueOnce(mockSession as any);
      vi.mocked(serverModule.serializeCookieSession).mockReturnValueOnce({
        cookieHeader: 'test-cookie=new_value; HttpOnly',
        session: mockSession as any,
        cookieValue: 'new_value',
      });

      const req = new Request('http://localhost/api/siwx/verify', {
        method: 'POST',
        body: JSON.stringify({ message: 'msg', signature: 'sig' }),
      });
      const response = await POST(req);

      expect(response.status).toBe(200);
      expect(response.headers.get('Set-Cookie')).toBe('test-cookie=new_value; HttpOnly');

      const data = await response.json();
      expect(data).toEqual(mockSession);
      expect(serverModule.toSession).toHaveBeenCalledWith(mockData);
    });
  });

  describe('DELETE /session', () => {
    it('destroys session by returning expired cookie', async () => {
      const req = new Request('http://localhost/api/siwx/session', {
        method: 'DELETE',
      });
      const response = await DELETE(req);
      expect(response.status).toBe(200);

      const setCookie = response.headers.get('Set-Cookie');
      expect(setCookie).toContain('test-cookie=;');
      expect(setCookie).toContain('Expires=Thu, 01 Jan 1970 00:00:00 GMT');
    });
  });

  describe('Routing (URL parsing)', () => {
    it('routes correctly based on URL path', async () => {
      const req = new Request('http://localhost/api/siwx/session', {
        method: 'GET',
      });
      const response = await GET(req);
      expect(response.status).toBe(200);
    });

    it('returns 404 for unknown actions', async () => {
      const req = new Request('http://localhost/api/siwx/unknown', {
        method: 'GET',
      });
      const response = await GET(req);
      expect(response.status).toBe(404);
    });
  });
});
