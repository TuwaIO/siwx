import { buildMessage, generateNonce } from '@tuwaio/siwx-core';
import { describe, expect, it, vi } from 'vitest';

import { createSiwxApiHandler, createStatelessDemoSiwxHandler } from '../next';
import * as serverModule from '../server';
import { MemorySiwxNonceStore, MemorySiwxSessionStore, signStatelessDemoSession } from '../server';

const TEST_SECRET = '0123456789abcdef0123456789abcdef'; // 32 characters

describe('SIWX Policy Negative Tests & Security Invariants', () => {
  describe('Durable Profile Policy Negative Tests', () => {
    it('rejects verification if domain does not match expected policy', async () => {
      const sessionStore = new MemorySiwxSessionStore();
      const nonceStore = new MemorySiwxNonceStore();
      const handler = createSiwxApiHandler({
        sessionStore,
        nonceStore,
        policy: {
          expectedDomain: 'quasar.tuwa.io',
          expectedUri: 'https://quasar.tuwa.io',
          allowedChainIds: ['eip155:1', 'eip155:8453'],
          requireExpirationTime: true,
        },
      });

      const message = buildMessage({
        domain: 'evil.phishing.io',
        address: 'eip155:1:0x1111111111111111111111111111111111111111',
        uri: 'https://evil.phishing.io/login',
        version: '1',
        chainId: 'eip155:1',
        nonce: generateNonce(),
        issuedAt: new Date().toISOString(),
        expirationTime: new Date(Date.now() + 600000).toISOString(),
      });

      const req = new Request('http://localhost/api/siwx/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message, signature: '0xmock' }),
      });

      const res = await handler.POST(req);
      expect(res.status).toBe(401);
      const data = await res.json();
      expect(data.error).toContain('Domain mismatch');
    });

    it('rejects verification if URI origin does not match expected policy', async () => {
      const sessionStore = new MemorySiwxSessionStore();
      const nonceStore = new MemorySiwxNonceStore();
      const handler = createSiwxApiHandler({
        sessionStore,
        nonceStore,
        policy: {
          expectedDomain: 'quasar.tuwa.io',
          expectedUri: 'https://quasar.tuwa.io',
          allowedChainIds: ['eip155:1'],
        },
      });

      const message = buildMessage({
        domain: 'quasar.tuwa.io',
        address: 'eip155:1:0x1111111111111111111111111111111111111111',
        uri: 'https://attacker.site/steal',
        version: '1',
        chainId: 'eip155:1',
        nonce: generateNonce(),
        issuedAt: new Date().toISOString(),
      });

      const req = new Request('http://localhost/api/siwx/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message, signature: '0xmock' }),
      });

      const res = await handler.POST(req);
      expect(res.status).toBe(401);
      const data = await res.json();
      expect(data.error).toContain('URI mismatch');
    });

    it('accepts valid subpath URI on the matching expected origin', async () => {
      const sessionStore = new MemorySiwxSessionStore();
      const nonceStore = new MemorySiwxNonceStore();
      const nonce = generateNonce();
      await nonceStore.issue({ nonce, ttlSeconds: 300 });

      const handler = createSiwxApiHandler({
        sessionStore,
        nonceStore,
        policy: {
          expectedDomain: 'quasar.tuwa.io',
          expectedUri: 'https://quasar.tuwa.io',
          allowedChainIds: ['eip155:1'],
        },
      });

      const message = buildMessage({
        domain: 'quasar.tuwa.io',
        address: 'eip155:1:0x1111111111111111111111111111111111111111',
        uri: 'https://quasar.tuwa.io/dashboard/organization/org_123/transactions?page=2',
        version: '1',
        chainId: 'eip155:1',
        nonce,
        issuedAt: new Date().toISOString(),
      });

      vi.spyOn(serverModule, 'verifySiwxPayload').mockResolvedValueOnce({
        success: true,
        data: {
          domain: 'quasar.tuwa.io',
          address: 'eip155:1:0x1111111111111111111111111111111111111111',
          uri: 'https://quasar.tuwa.io/dashboard/organization/org_123/transactions?page=2',
          version: '1',
          chainId: 'eip155:1',
          nonce,
          issuedAt: new Date().toISOString(),
        },
      });

      const req = new Request('http://localhost/api/siwx/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message, signature: '0xmock' }),
      });

      const res = await handler.POST(req);
      expect(res.status).toBe(200);
      const data = await res.json();
      expect(data.address).toBe('eip155:1:0x1111111111111111111111111111111111111111');
    });

    it('rejects disallowed chain IDs according to policy', async () => {
      const sessionStore = new MemorySiwxSessionStore();
      const nonceStore = new MemorySiwxNonceStore();
      const handler = createSiwxApiHandler({
        sessionStore,
        nonceStore,
        policy: {
          allowedChainIds: ['eip155:1', 'eip155:8453'],
        },
      });

      const message = buildMessage({
        domain: 'tuwa.io',
        address: 'eip155:137:0x1111111111111111111111111111111111111111',
        uri: 'https://tuwa.io',
        version: '1',
        chainId: 'eip155:137',
        nonce: generateNonce(),
        issuedAt: new Date().toISOString(),
      });

      const req = new Request('http://localhost/api/siwx/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message, signature: '0xmock' }),
      });

      const res = await handler.POST(req);
      expect(res.status).toBe(401);
      const data = await res.json();
      expect(data.error).toContain('Chain ID "eip155:137" is not allowed');
    });

    it('rejects missing expirationTime when policy requires it', async () => {
      const sessionStore = new MemorySiwxSessionStore();
      const nonceStore = new MemorySiwxNonceStore();
      const handler = createSiwxApiHandler({
        sessionStore,
        nonceStore,
        policy: {
          requireExpirationTime: true,
        },
      });

      const message = buildMessage({
        domain: 'tuwa.io',
        address: 'eip155:1:0x1111111111111111111111111111111111111111',
        uri: 'https://tuwa.io',
        version: '1',
        chainId: 'eip155:1',
        nonce: generateNonce(),
        issuedAt: new Date().toISOString(),
        // no expirationTime
      });

      const req = new Request('http://localhost/api/siwx/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message, signature: '0xmock' }),
      });

      const res = await handler.POST(req);
      expect(res.status).toBe(401);
      const data = await res.json();
      expect(data.error).toContain('expirationTime is required');
    });

    it('rejects stale issuedAt exceeding maxIssuedAtAgeSeconds', async () => {
      const sessionStore = new MemorySiwxSessionStore();
      const nonceStore = new MemorySiwxNonceStore();
      const handler = createSiwxApiHandler({
        sessionStore,
        nonceStore,
        policy: {
          maxIssuedAtAgeSeconds: 120, // 2 minutes max age
          clockSkewSeconds: 0,
        },
      });

      // Issued 10 minutes ago
      const staleIssuedAt = new Date(Date.now() - 600000).toISOString();
      const message = buildMessage({
        domain: 'tuwa.io',
        address: 'eip155:1:0x1111111111111111111111111111111111111111',
        uri: 'https://tuwa.io',
        version: '1',
        chainId: 'eip155:1',
        nonce: generateNonce(),
        issuedAt: staleIssuedAt,
      });

      const req = new Request('http://localhost/api/siwx/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message, signature: '0xmock' }),
      });

      const res = await handler.POST(req);
      expect(res.status).toBe(401);
      const data = await res.json();
      expect(data.error).toContain('is older than the allowed max age');
    });

    it('rejects request body exceeding maximum payload boundary (413 Payload Too Large)', async () => {
      const sessionStore = new MemorySiwxSessionStore();
      const nonceStore = new MemorySiwxNonceStore();
      const handler = createSiwxApiHandler({
        sessionStore,
        nonceStore,
      });

      // 70 KB payload
      const hugeString = 'A'.repeat(70000);
      const req = new Request('http://localhost/api/siwx/verify', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Content-Length': '70000',
        },
        body: JSON.stringify({ message: hugeString, signature: '0x123' }),
      });

      const res = await handler.POST(req);
      expect(res.status).toBe(413);
      const data = await res.json();
      expect(data.error).toBe('Payload Too Large');
    });

    it('rejects malformed JSON with 400 Bad Request', async () => {
      const sessionStore = new MemorySiwxSessionStore();
      const nonceStore = new MemorySiwxNonceStore();
      const handler = createSiwxApiHandler({
        sessionStore,
        nonceStore,
      });

      const req = new Request('http://localhost/api/siwx/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: 'invalid-json-payload-{{{',
      });

      const res = await handler.POST(req);
      expect(res.status).toBe(400);
      const data = await res.json();
      expect(data.error).toBe('Invalid JSON payload');
    });

    it('ensures concurrent nonce consumption yields exactly one winner', async () => {
      const nonceStore = new MemorySiwxNonceStore();
      const nonce = generateNonce();
      await nonceStore.issue({ nonce, ttlSeconds: 300 });

      // Run 10 parallel consume requests
      const promises = Array.from({ length: 10 }).map(() => nonceStore.consume({ nonce }));
      const results = await Promise.all(promises);

      const successfulConsumptions = results.filter((r) => r === true);
      expect(successfulConsumptions).toHaveLength(1);
    });

    it('fails closed with 500 when session store throws an error', async () => {
      const failingSessionStore = {
        create: vi.fn().mockRejectedValue(new Error('Redis connection down')),
        get: vi.fn().mockRejectedValue(new Error('Redis connection down')),
        bindSubject: vi.fn().mockRejectedValue(new Error('Redis connection down')),
        revoke: vi.fn().mockRejectedValue(new Error('Redis connection down')),
      };
      const nonceStore = new MemorySiwxNonceStore();
      const nonce = generateNonce();
      await nonceStore.issue({ nonce, ttlSeconds: 300 });

      const handler = createSiwxApiHandler({
        sessionStore: failingSessionStore,
        nonceStore,
      });

      vi.spyOn(serverModule, 'verifySiwxPayload').mockResolvedValueOnce({
        success: true,
        data: {
          domain: 'tuwa.io',
          address: 'eip155:1:0x123',
          uri: 'https://tuwa.io',
          version: '1',
          chainId: 'eip155:1',
          nonce,
          issuedAt: new Date().toISOString(),
        },
      });

      const req = new Request('http://localhost/api/siwx/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: 'msg', signature: 'sig' }),
      });

      const res = await handler.POST(req);
      expect(res.status).toBe(500);
      const data = await res.json();
      expect(data.error).toBe('Internal Server Error');
    });
  });

  describe('Stateless Demo Profile Security & Tampering Tests', () => {
    it('throws fatal error on initialization if secret is missing or shorter than 32 characters', () => {
      // @ts-expect-error test missing secret
      expect(() => createStatelessDemoSiwxHandler({})).toThrow('requires a `signingSecret` of at least 32 characters');
      expect(() => createStatelessDemoSiwxHandler({ signingSecret: 'too-short' })).toThrow(
        'requires a `signingSecret` of at least 32 characters',
      );
    });

    it('rejects forged or modified signed demo session tokens', async () => {
      const handler = createStatelessDemoSiwxHandler({
        signingSecret: TEST_SECRET,
      });

      const validToken = await signStatelessDemoSession(
        {
          address: 'eip155:1:0x1111111111111111111111111111111111111111',
          chainId: 'eip155:1',
          domain: 'tuwa.io',
          nonce: '12345678',
          issuedAt: new Date().toISOString(),
        },
        TEST_SECRET,
        1800,
      );

      // Tamper with payload part of token
      const [, signature] = validToken.split('.');
      const tamperedPayload = Buffer.from(
        JSON.stringify({
          version: 1,
          mode: 'demo',
          address: 'eip155:1:0xattacker_address',
          chainId: 'eip155:1',
          domain: 'tuwa.io',
          nonce: '12345678',
          issuedAt: new Date().toISOString(),
          sessionId: 'fake',
        }),
      ).toString('base64url');

      const tamperedToken = `${tamperedPayload}.${signature}`;

      const req = new Request('http://localhost/api/siwx/session', {
        method: 'GET',
        headers: { Cookie: `siwx-session-v2=${tamperedToken}` },
      });

      const res = await handler.GET(req);
      expect(res.status).toBe(200);
      const data = await res.json();
      expect(data).toBeNull();
    });

    it('rejects demo session tokens signed with a different secret', async () => {
      const OTHER_SECRET = '9999999999abcdef0123456789abcdef';
      const handler = createStatelessDemoSiwxHandler({
        signingSecret: TEST_SECRET,
      });

      const tokenSignedWithOther = await signStatelessDemoSession(
        {
          address: 'eip155:1:0x1111111111111111111111111111111111111111',
          chainId: 'eip155:1',
          domain: 'tuwa.io',
          nonce: '12345678',
          issuedAt: new Date().toISOString(),
        },
        OTHER_SECRET,
        1800,
      );

      const req = new Request('http://localhost/api/siwx/session', {
        method: 'GET',
        headers: { Cookie: `siwx-session-v2=${tokenSignedWithOther}` },
      });

      const res = await handler.GET(req);
      expect(res.status).toBe(200);
      const data = await res.json();
      expect(data).toBeNull();
    });

    it('rejects expired demo tokens', async () => {
      const handler = createStatelessDemoSiwxHandler({
        signingSecret: TEST_SECRET,
        policy: { clockSkewSeconds: 0 },
      });

      // Token that expired 5 minutes ago
      const expiredTime = new Date(Date.now() - 300000).toISOString();
      const expiredToken = await signStatelessDemoSession(
        {
          address: 'eip155:1:0x1111111111111111111111111111111111111111',
          chainId: 'eip155:1',
          domain: 'tuwa.io',
          nonce: '12345678',
          issuedAt: new Date(Date.now() - 600000).toISOString(),
          expirationTime: expiredTime,
        },
        TEST_SECRET,
        -100, // Negative TTL
      );

      const req = new Request('http://localhost/api/siwx/session', {
        method: 'GET',
        headers: { Cookie: `siwx-session-v2=${expiredToken}` },
      });

      const res = await handler.GET(req);
      expect(res.status).toBe(200);
      const data = await res.json();
      expect(data).toBeNull();
    });

    it('enforces custom maxTransactionPayloadBytes in demo mode', async () => {
      const handler = createStatelessDemoSiwxHandler({
        signingSecret: TEST_SECRET,
        demoLimits: {
          maxTransactionPayloadBytes: 1024, // 1 KB custom limit
        },
      });

      const req = new Request('http://localhost/api/siwx/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: 'A'.repeat(2048), signature: 'sig' }),
      });

      const res = await handler.POST(req);
      expect(res.status).toBe(413);
      const data = await res.json();
      expect(data.error).toBe('Payload Too Large');
    });

    it('clears session cookie on logout', async () => {
      const handler = createStatelessDemoSiwxHandler({
        signingSecret: TEST_SECRET,
        cookieOptions: { name: 'demo-cookie', path: '/', sameSite: 'Strict', secure: true },
      });

      const req = new Request('http://localhost/api/siwx/logout', {
        method: 'POST',
      });

      const res = await handler.POST(req);
      expect(res.status).toBe(200);
      const setCookie = res.headers.get('set-cookie');
      expect(setCookie).toContain('demo-cookie=');
      expect(setCookie).toContain('Max-Age=0');
      expect(setCookie).toContain('Path=/');
      expect(setCookie).toContain('SameSite=Strict');
      expect(setCookie).toContain('Secure');
    });
  });
});
