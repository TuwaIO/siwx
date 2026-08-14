/**
 * @fileoverview Next.js App Router (Route Handlers) API helper for SIWX.
 * Provides durable production handler and stateless demo handler.
 */

import type { SiwxVerificationPolicy } from '@tuwaio/siwx-core';
import { generateNonce } from '@tuwaio/siwx-core';

import {
  createClearCookie,
  createSessionCookie,
  parseCookie,
  signStatelessDemoSession,
  toSession,
  verifySiwxPayload,
  verifyStatelessDemoSession,
} from './server';
import type {
  CookieOptions,
  ServerVerifyOptions,
  SiwxNonceStore,
  SiwxSessionStore,
  StatelessDemoLimits,
} from './types';

export interface SiwxApiHandlerOptions {
  /**
   * Durable session store instance (e.g. RedisSiwxSessionStore or MemorySiwxSessionStore for tests).
   */
  sessionStore: SiwxSessionStore;

  /**
   * Durable single-use nonce store instance (e.g. RedisSiwxNonceStore or MemorySiwxNonceStore for tests).
   */
  nonceStore: SiwxNonceStore;

  /**
   * Verification policy to enforce (expected domains, URIs, allowed chains, expiration limits).
   */
  policy?: SiwxVerificationPolicy;

  /**
   * Cookie configuration options (name, secure, path, domain, maxAge).
   */
  cookieOptions?: CookieOptions;

  /**
   * Additional verification options (e.g. custom public client).
   */
  verifyOptions?: Omit<ServerVerifyOptions, 'policy' | 'usedNonces'>;

  /**
   * Session time-to-live in seconds (defaults to 7 days = 604800s).
   */
  ttlSeconds?: number;
}

export interface StatelessDemoSiwxHandlerOptions {
  /**
   * Server-only cryptographic secret for HMAC signing (minimum 32 characters).
   * MUST NEVER be exposed to the browser or client-side bundles.
   */
  signingSecret: string;

  /**
   * Verification policy to enforce.
   */
  policy?: SiwxVerificationPolicy;

  /**
   * Cookie configuration options.
   */
  cookieOptions?: CookieOptions;

  /**
   * Demo limits (payload size, max requests).
   */
  demoLimits?: StatelessDemoLimits;

  /**
   * Additional verification options.
   */
  verifyOptions?: Omit<ServerVerifyOptions, 'policy'>;

  /**
   * Session TTL in seconds for demo profile (defaults to 1800s = 30 minutes).
   */
  ttlSeconds?: number;
}

/**
 * Creates a standard production Next.js App Router route handler for SIWX with durable storage.
 * Requires persistent session and nonce stores (Redis, PostgreSQL, etc.).
 *
 * @param options - Configuration including sessionStore, nonceStore, and policy.
 * @returns Object with `GET`, `POST`, and `DELETE` HTTP route handlers.
 *
 * @example
 * ```ts
 * // app/api/siwx/[...siwx]/route.ts
 * import { createSiwxApiHandler } from '@tuwaio/siwx-server/next';
 * import { sessionStore, nonceStore } from '@/lib/authStores';
 *
 * const handler = createSiwxApiHandler({
 *   sessionStore,
 *   nonceStore,
 *   policy: { expectedDomain: 'app.tuwa.io' },
 * });
 *
 * export const { GET, POST, DELETE } = handler;
 * ```
 */
export function createSiwxApiHandler(options: SiwxApiHandlerOptions) {
  if (!options?.sessionStore || !options?.nonceStore) {
    throw new Error(
      '[SIWX-SERVER] createSiwxApiHandler requires both `sessionStore` and `nonceStore`. For zero-infrastructure demos without storage, use `createStatelessDemoSiwxHandler`.',
    );
  }

  const cookieName = options.cookieOptions?.name || 'siwx-session-v2';
  const ttlSeconds = options.ttlSeconds ?? (options.cookieOptions?.maxAge || 60 * 60 * 24 * 7);

  const universalHandler = async (req: Request) => {
    try {
      const url = new URL(req.url);
      const pathParts = url.pathname.split('/').filter(Boolean);
      const action = pathParts[pathParts.length - 1] || '';

      // 1. GET /session -> Return current session from store
      if (req.method === 'GET' && action === 'session') {
        const sessionId = parseCookie(req.headers.get('cookie'), cookieName);
        if (!sessionId) {
          return new Response(JSON.stringify(null), {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
          });
        }

        const record = await options.sessionStore.get(sessionId);
        return new Response(JSON.stringify(record?.session ?? null), {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
        });
      }

      // 2. GET/POST /nonce -> Issue a new challenge nonce with atomic store registration
      if ((req.method === 'GET' || req.method === 'POST') && action === 'nonce') {
        const nonce = generateNonce();
        await options.nonceStore.issue({ nonce, ttlSeconds: 300 });
        return new Response(JSON.stringify({ nonce }), {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
        });
      }

      // 3. POST /verify -> Validate payload, atomically consume nonce, issue durable session
      if (req.method === 'POST' && action === 'verify') {
        const payload = await req.json();

        if (!payload.message || !payload.signature) {
          return new Response(JSON.stringify({ error: 'Missing message or signature' }), {
            status: 400,
            headers: { 'Content-Type': 'application/json' },
          });
        }

        const result = await verifySiwxPayload(payload, {
          ...options.verifyOptions,
          policy: options.policy,
        });

        if (!result.success || !result.data) {
          return new Response(JSON.stringify({ error: result.error || 'Verification failed' }), {
            status: 401,
            headers: { 'Content-Type': 'application/json' },
          });
        }

        // Atomically consume nonce
        const nonceConsumed = await options.nonceStore.consume({ nonce: result.data.nonce });
        if (!nonceConsumed) {
          return new Response(JSON.stringify({ error: 'Nonce replay detected or nonce expired' }), {
            status: 401,
            headers: { 'Content-Type': 'application/json' },
          });
        }

        const session = toSession(result.data);
        const record = await options.sessionStore.create({ session, ttlSeconds });

        const cookieHeader = createSessionCookie(record.id, {
          ...options.cookieOptions,
          name: cookieName,
          maxAge: ttlSeconds,
        });

        return new Response(JSON.stringify(session), {
          status: 200,
          headers: {
            'Content-Type': 'application/json',
            'Set-Cookie': cookieHeader,
          },
        });
      }

      // 4. DELETE /session (or POST /logout) -> Revoke session in store and clear cookie
      if ((req.method === 'DELETE' && action === 'session') || (req.method === 'POST' && action === 'logout')) {
        const sessionId = parseCookie(req.headers.get('cookie'), cookieName);
        if (sessionId) {
          await options.sessionStore.revoke(sessionId);
        }

        return new Response(JSON.stringify({ success: true }), {
          status: 200,
          headers: {
            'Content-Type': 'application/json',
            'Set-Cookie': createClearCookie({ ...options.cookieOptions, name: cookieName }),
          },
        });
      }

      return new Response(JSON.stringify({ error: 'Not Found' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' },
      });
    } catch (error) {
      console.error('[SIWX-SERVER] Durable Handler error:', error);
      return new Response(JSON.stringify({ error: 'Internal Server Error' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      });
    }
  };

  return {
    GET: universalHandler,
    POST: universalHandler,
    DELETE: universalHandler,
  };
}

/**
 * Creates a stateless demo Next.js App Router route handler for SIWX.
 * Uses authenticated HMAC-SHA256 tokens in HttpOnly cookies without requiring Redis or a database.
 *
 * Intended STRICTLY for zero-infrastructure demonstration apps and website prototypes.
 *
 * @param options - Configuration including server signingSecret, policy, and demoLimits.
 * @returns Object with `GET`, `POST`, and `DELETE` HTTP route handlers.
 *
 * @example
 * ```ts
 * // app/api/siwx/[...siwx]/route.ts
 * import { createStatelessDemoSiwxHandler } from '@tuwaio/siwx-server/next';
 *
 * const handler = createStatelessDemoSiwxHandler({
 *   signingSecret: process.env.SIWX_DEMO_SIGNING_SECRET!,
 *   policy: {
 *     expectedDomain: 'tuwa.io',
 *     requireExpirationTime: true,
 *   },
 * });
 *
 * export const { GET, POST, DELETE } = handler;
 * ```
 */
export function createStatelessDemoSiwxHandler(options: StatelessDemoSiwxHandlerOptions) {
  if (!options?.signingSecret || options.signingSecret.length < 32) {
    throw new Error(
      '[SIWX-SERVER] createStatelessDemoSiwxHandler requires a `signingSecret` of at least 32 characters.',
    );
  }

  const cookieName = options.cookieOptions?.name || 'siwx-session-v2';
  const ttlSeconds = options.ttlSeconds ?? (options.cookieOptions?.maxAge || 1800); // 30 minutes default

  const universalHandler = async (req: Request) => {
    try {
      const url = new URL(req.url);
      const pathParts = url.pathname.split('/').filter(Boolean);
      const action = pathParts[pathParts.length - 1] || '';

      // 1. GET /session -> Verify signed cookie and return session
      if (req.method === 'GET' && action === 'session') {
        const token = parseCookie(req.headers.get('cookie'), cookieName);
        if (!token) {
          return new Response(JSON.stringify(null), {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
          });
        }

        const session = await verifyStatelessDemoSession(token, options.signingSecret, options.policy);
        return new Response(JSON.stringify(session), {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
        });
      }

      // 2. GET/POST /nonce -> Return a random nonce
      if ((req.method === 'GET' || req.method === 'POST') && action === 'nonce') {
        const nonce = generateNonce();
        return new Response(JSON.stringify({ nonce }), {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
        });
      }

      // 3. POST /verify -> Validate payload and issue signed demo token
      if (req.method === 'POST' && action === 'verify') {
        const payload = await req.json();

        if (!payload.message || !payload.signature) {
          return new Response(JSON.stringify({ error: 'Missing message or signature' }), {
            status: 400,
            headers: { 'Content-Type': 'application/json' },
          });
        }

        const result = await verifySiwxPayload(payload, {
          ...options.verifyOptions,
          policy: options.policy,
        });

        if (!result.success || !result.data) {
          return new Response(JSON.stringify({ error: result.error || 'Verification failed' }), {
            status: 401,
            headers: { 'Content-Type': 'application/json' },
          });
        }

        const session = toSession(result.data);
        const signedToken = await signStatelessDemoSession(session, options.signingSecret, ttlSeconds);

        const cookieHeader = createSessionCookie(signedToken, {
          ...options.cookieOptions,
          name: cookieName,
          maxAge: ttlSeconds,
        });

        return new Response(JSON.stringify(session), {
          status: 200,
          headers: {
            'Content-Type': 'application/json',
            'Set-Cookie': cookieHeader,
          },
        });
      }

      // 4. DELETE /session (or POST /logout) -> Clear cookie
      if ((req.method === 'DELETE' && action === 'session') || (req.method === 'POST' && action === 'logout')) {
        return new Response(JSON.stringify({ success: true }), {
          status: 200,
          headers: {
            'Content-Type': 'application/json',
            'Set-Cookie': createClearCookie({ ...options.cookieOptions, name: cookieName }),
          },
        });
      }

      return new Response(JSON.stringify({ error: 'Not Found' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' },
      });
    } catch (error) {
      console.error('[SIWX-SERVER] Stateless Demo Handler error:', error);
      return new Response(JSON.stringify({ error: 'Internal Server Error' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      });
    }
  };

  return {
    GET: universalHandler,
    POST: universalHandler,
    DELETE: universalHandler,
  };
}

export { getSiwxServerSession } from './server';
export type { GetSiwxServerSessionOptions } from './types';
