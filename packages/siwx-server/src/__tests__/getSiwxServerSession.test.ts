import { describe, expect, it } from 'vitest';

import { getSiwxServerSession, MemorySiwxSessionStore, signStatelessDemoSession } from '../server';
import type { SiwxSession } from '../types';

const TEST_SECRET = '0123456789abcdef0123456789abcdef';

const sampleSession: SiwxSession = {
  address: 'eip155:1:0x1234567890123456789012345678901234567890',
  chainId: 'eip155:1',
  domain: 'app.tuwa.io',
  nonce: 'abc12345',
  issuedAt: new Date().toISOString(),
};

describe('getSiwxServerSession()', () => {
  describe('Durable Profile (sessionStore)', () => {
    it('resolves session from Next.js cookies() object', async () => {
      const sessionStore = new MemorySiwxSessionStore({ allowInProduction: true });
      const record = await sessionStore.create({ session: sampleSession, ttlSeconds: 3600 });

      const mockCookies = {
        get(name: string) {
          if (name === 'siwx-session-v2') return { value: record.id };
          return undefined;
        },
      };

      const session = await getSiwxServerSession({
        cookieSource: mockCookies,
        sessionStore,
      });

      expect(session).toEqual(sampleSession);
    });

    it('resolves session from raw Cookie header string', async () => {
      const sessionStore = new MemorySiwxSessionStore({ allowInProduction: true });
      const record = await sessionStore.create({ session: sampleSession, ttlSeconds: 3600 });

      const cookieHeader = `other=123; siwx-session-v2=${record.id}; test=abc`;

      const session = await getSiwxServerSession({
        cookieSource: cookieHeader,
        sessionStore,
      });

      expect(session).toEqual(sampleSession);
    });

    it('resolves session from standard Web API Request', async () => {
      const sessionStore = new MemorySiwxSessionStore({ allowInProduction: true });
      const record = await sessionStore.create({ session: sampleSession, ttlSeconds: 3600 });

      const req = new Request('https://app.tuwa.io/api/action', {
        headers: {
          cookie: `siwx-session-v2=${record.id}`,
        },
      });

      const session = await getSiwxServerSession({
        cookieSource: req,
        sessionStore,
      });

      expect(session).toEqual(sampleSession);
    });

    it('supports custom cookieName', async () => {
      const sessionStore = new MemorySiwxSessionStore({ allowInProduction: true });
      const record = await sessionStore.create({ session: sampleSession, ttlSeconds: 3600 });

      const mockCookies = {
        get(name: string) {
          if (name === 'custom_auth_cookie') return { value: record.id };
          return undefined;
        },
      };

      const session = await getSiwxServerSession({
        cookieSource: mockCookies,
        cookieName: 'custom_auth_cookie',
        sessionStore,
      });

      expect(session).toEqual(sampleSession);
    });

    it('enforces verification policy on retrieved session', async () => {
      const sessionStore = new MemorySiwxSessionStore({ allowInProduction: true });
      const record = await sessionStore.create({ session: sampleSession, ttlSeconds: 3600 });

      const mockCookies = {
        get: () => ({ value: record.id }),
      };

      // Allowed domain matches
      const validSession = await getSiwxServerSession({
        cookieSource: mockCookies,
        sessionStore,
        policy: { expectedDomain: 'app.tuwa.io' },
      });
      expect(validSession).toEqual(sampleSession);

      // Domain mismatch fails
      const invalidSession = await getSiwxServerSession({
        cookieSource: mockCookies,
        sessionStore,
        policy: { expectedDomain: 'malicious.com' },
      });
      expect(invalidSession).toBeNull();
    });

    it('returns null if session not found or expired in store', async () => {
      const sessionStore = new MemorySiwxSessionStore({ allowInProduction: true });

      const mockCookies = {
        get: () => ({ value: 'non-existent-id' }),
      };

      const session = await getSiwxServerSession({
        cookieSource: mockCookies,
        sessionStore,
      });

      expect(session).toBeNull();
    });
  });

  describe('Stateless Demo Profile (signingSecret)', () => {
    it('resolves session from valid HMAC signed demo token in cookie', async () => {
      const token = await signStatelessDemoSession(sampleSession, TEST_SECRET, 1800);

      const mockCookies = {
        get: () => ({ value: token }),
      };

      const session = await getSiwxServerSession({
        cookieSource: mockCookies,
        signingSecret: TEST_SECRET,
      });

      expect(session?.address).toBe(sampleSession.address);
      expect(session?.chainId).toBe(sampleSession.chainId);
      expect(session?.domain).toBe(sampleSession.domain);
    });

    it('returns null if demo token signature is invalid', async () => {
      const token = await signStatelessDemoSession(sampleSession, TEST_SECRET, 1800);
      const tampered = token.slice(0, -5) + 'xxxxx';

      const mockCookies = {
        get: () => ({ value: tampered }),
      };

      const session = await getSiwxServerSession({
        cookieSource: mockCookies,
        signingSecret: TEST_SECRET,
      });

      expect(session).toBeNull();
    });

    it('returns null if demo token signed with a different secret', async () => {
      const token = await signStatelessDemoSession(sampleSession, TEST_SECRET, 1800);
      const wrongSecret = 'wrongsecretwrongsecretwrongsecret!';

      const mockCookies = {
        get: () => ({ value: token }),
      };

      const session = await getSiwxServerSession({
        cookieSource: mockCookies,
        signingSecret: wrongSecret,
      });

      expect(session).toBeNull();
    });
  });

  describe('Edge cases and empty inputs', () => {
    it('returns null if cookieSource is null or undefined', async () => {
      const session = await getSiwxServerSession({
        cookieSource: null,
        signingSecret: TEST_SECRET,
      });
      expect(session).toBeNull();
    });

    it('returns null if neither sessionStore nor signingSecret provided', async () => {
      const mockCookies = {
        get: () => ({ value: 'some-value' }),
      };
      const session = await getSiwxServerSession({
        cookieSource: mockCookies,
      });
      expect(session).toBeNull();
    });
  });
});
