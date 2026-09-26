/**
 * Next.js App Router route handlers, imported from `@tuwaio/siwx-server/next`.
 *
 * @module next
 */

import type { SiwxVerificationPolicy } from '@tuwaio/siwx-core';
import { generateNonce } from '@tuwaio/siwx-core';

import {
  createClearCookie,
  createSessionCookie,
  issueStatelessDemoNonce,
  parseCookie,
  signStatelessDemoSession,
  toSession,
  verifySiwxPayload,
  verifyStatelessDemoNonce,
  verifyStatelessDemoSession,
} from './server';
import type {
  CookieOptions,
  ServerVerifyOptions,
  SiwxNonceStore,
  SiwxSessionStore,
  StatelessDemoLimits,
} from './types';

/**
 * Options of {@link createSiwxApiHandler}.
 */
/** Lifetime of the challenge nonces issued by the `/nonce` routes, in seconds. */
const NONCE_TTL_SECONDS = 300;

export interface SiwxApiHandlerOptions {
  /**
   * Durable session store shared by every server instance (your Redis or database implementation;
   * `MemorySiwxSessionStore` in development and tests).
   */
  sessionStore: SiwxSessionStore;

  /**
   * Durable single-use nonce store shared by every server instance (your Redis or database implementation;
   * `MemorySiwxNonceStore` in development and tests).
   */
  nonceStore: SiwxNonceStore;

  /**
   * Policy enforced by `POST /verify` (domain, URI, chains, timing). Set at least `expectedDomain`: without a policy
   * the message domain is not checked.
   */
  policy?: SiwxVerificationPolicy;

  /**
   * Attributes of the session cookie. `maxAge` is replaced by the session TTL.
   */
  cookieOptions?: CookieOptions;

  /**
   * Extra options of `verifySiwxPayload`, for example `publicClient` for EIP-1271 wallets.
   */
  verifyOptions?: Omit<ServerVerifyOptions, 'policy' | 'usedNonces'>;

  /**
   * Session lifetime in seconds, used for the store record and the cookie `Max-Age`. Defaults to
   * `cookieOptions.maxAge`, then to 604800 (7 days).
   */
  ttlSeconds?: number;
}

/**
 * Options of {@link createStatelessDemoSiwxHandler}.
 */
export interface StatelessDemoSiwxHandlerOptions {
  /**
   * Server-only HMAC secret of at least 32 characters. Never expose it to the browser. Rotating it invalidates every
   * issued token.
   */
  signingSecret: string;

  /**
   * Policy enforced by `POST /verify`. For the demo profile, set `expectedDomain`, `requireExpirationTime` and a
   * short `maxSessionLifetimeSeconds`.
   */
  policy?: SiwxVerificationPolicy;

  /**
   * Attributes of the session cookie. `maxAge` is replaced by the token TTL.
   */
  cookieOptions?: CookieOptions;

  /**
   * Request limits (maximum body size of `POST /verify`).
   */
  demoLimits?: StatelessDemoLimits;

  /**
   * Extra options of `verifySiwxPayload`, for example `publicClient` or `usedNonces`.
   */
  verifyOptions?: Omit<ServerVerifyOptions, 'policy'>;

  /**
   * Token and cookie lifetime in seconds. Defaults to `cookieOptions.maxAge`, then to 1800 (30 minutes). A message
   * `expirationTime`, when present, sets the token expiry instead.
   */
  ttlSeconds?: number;
}

/**
 * Creates the SIWX route handlers of the durable (production) profile for a Next.js App Router catch-all route,
 * for example `app/api/siwx/[...siwx]/route.ts`. The action is taken from the last path segment:
 *
 * - `GET|POST …/nonce`: issues a nonce, stores it in `nonceStore` for 300 seconds and returns `{ nonce }`.
 * - `POST …/verify`: accepts a JSON `{ message, signature }` of up to 64 KB, runs `verifySiwxPayload` with the
 *   policy, consumes the nonce (so only nonces issued by `/nonce` are accepted, once), creates a session in
 *   `sessionStore`, sets the session ID as an `HttpOnly` cookie and returns the `SiwxSession` JSON.
 *   Responds 400 for a malformed body, 401 for a failed verification or nonce, 413 for a too large body.
 * - `GET …/session`: returns the stored session of the cookie, or `null`.
 * - `DELETE …/session` or `POST …/logout`: revokes the session in the store and clears the cookie.
 *
 * Other paths return 404; unexpected errors are logged with `console.error` and return 500.
 *
 * @param options - Stores, policy, cookie and verification options.
 * @returns Route handlers to export as `GET`, `POST` and `DELETE`.
 * @throws {Error} If `sessionStore` or `nonceStore` is missing.
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
    throw new Error('[SIWX-SERVER] createSiwxApiHandler requires both `sessionStore` and `nonceStore`.');
  }

  const cookieName = options.cookieOptions?.name || 'siwx-session-v2';
  const ttlSeconds = options.ttlSeconds ?? (options.cookieOptions?.maxAge || 60 * 60 * 24 * 7);
  const maxPayloadBytes = 65536; // 64 KB default request boundary limit

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
        await options.nonceStore.issue({ nonce, ttlSeconds: NONCE_TTL_SECONDS });
        return new Response(JSON.stringify({ nonce }), {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
        });
      }

      // 3. POST /verify -> Validate payload, atomically consume nonce, issue durable session
      if (req.method === 'POST' && action === 'verify') {
        const contentLength = req.headers.get('content-length');
        if (contentLength && parseInt(contentLength, 10) > maxPayloadBytes) {
          return new Response(JSON.stringify({ error: 'Payload Too Large' }), {
            status: 413,
            headers: { 'Content-Type': 'application/json' },
          });
        }

        const rawBody = await req.text();
        if (rawBody.length > maxPayloadBytes) {
          return new Response(JSON.stringify({ error: 'Payload Too Large' }), {
            status: 413,
            headers: { 'Content-Type': 'application/json' },
          });
        }

        let rawParsed: Record<string, unknown>;
        try {
          rawParsed = JSON.parse(rawBody);
        } catch {
          return new Response(JSON.stringify({ error: 'Invalid JSON payload' }), {
            status: 400,
            headers: { 'Content-Type': 'application/json' },
          });
        }

        if (!rawParsed || typeof rawParsed.message !== 'string' || typeof rawParsed.signature !== 'string') {
          return new Response(JSON.stringify({ error: 'Missing message or signature' }), {
            status: 400,
            headers: { 'Content-Type': 'application/json' },
          });
        }

        const payload = {
          message: rawParsed.message,
          signature: rawParsed.signature,
        };

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
 * Creates the SIWX route handlers of the stateless demo profile for a Next.js App Router catch-all route. The
 * session is an HMAC-signed token in an `HttpOnly` cookie (see {@link signStatelessDemoSession}), so no database or
 * Redis is needed. Intended for demos and prototypes only.
 *
 * - `GET|POST …/nonce`: returns `{ nonce }`, a nonce signed with the secret and valid for 300 seconds (see
 *   {@link issueStatelessDemoNonce}). Nothing is stored.
 * - `POST …/verify`: accepts a JSON `{ message, signature }` (size limit from `demoLimits`), runs
 *   `verifySiwxPayload` with the policy, accepts the message nonce only if it was issued by `/nonce`, has not
 *   expired and has not been used before on this server instance, sets the signed token as the session cookie and
 *   returns the `SiwxSession` JSON. Responds 400, 401 or 413 like the durable handler.
 * - `GET …/session`: verifies the cookie token and returns the session, or `null`.
 * - `DELETE …/session` or `POST …/logout`: clears the cookie.
 *
 * Security limits: used nonces are remembered in the memory of each server instance only, so with several instances
 * a signed message can be replayed on another instance within the 300-second nonce lifetime; tokens cannot be
 * revoked before they expire. Keep `requireExpirationTime` and a short `maxSessionLifetimeSeconds`.
 *
 * Side effects: keeps the used nonces of this handler in memory until they expire.
 *
 * @param options - Signing secret, policy, cookie, limits and verification options.
 * @returns Route handlers to export as `GET`, `POST` and `DELETE`.
 * @throws {Error} If `signingSecret` is missing or shorter than 32 characters.
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
  const maxPayloadBytes = options.demoLimits?.maxTransactionPayloadBytes ?? 65536; // 64 KB default request boundary limit

  // Nonces accepted by this handler instance, kept until they expire. Stateless nonces are otherwise reusable.
  const usedNonces = new Map<string, number>();
  const consumeNonce = (nonce: string): boolean => {
    const now = Date.now();
    for (const [usedNonce, expiresAt] of usedNonces) {
      if (expiresAt < now) usedNonces.delete(usedNonce);
    }
    if (usedNonces.has(nonce)) return false;
    usedNonces.set(nonce, now + NONCE_TTL_SECONDS * 1000);
    return true;
  };

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

      // 2. GET/POST /nonce -> Issue a signed, short-lived nonce (no storage needed)
      if ((req.method === 'GET' || req.method === 'POST') && action === 'nonce') {
        const nonce = await issueStatelessDemoNonce(options.signingSecret, NONCE_TTL_SECONDS);
        return new Response(JSON.stringify({ nonce }), {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
        });
      }

      // 3. POST /verify -> Validate payload and issue signed demo token
      if (req.method === 'POST' && action === 'verify') {
        const contentLength = req.headers.get('content-length');
        if (contentLength && parseInt(contentLength, 10) > maxPayloadBytes) {
          return new Response(JSON.stringify({ error: 'Payload Too Large' }), {
            status: 413,
            headers: { 'Content-Type': 'application/json' },
          });
        }

        const rawBody = await req.text();
        if (rawBody.length > maxPayloadBytes) {
          return new Response(JSON.stringify({ error: 'Payload Too Large' }), {
            status: 413,
            headers: { 'Content-Type': 'application/json' },
          });
        }

        let rawParsed: Record<string, unknown>;
        try {
          rawParsed = JSON.parse(rawBody);
        } catch {
          return new Response(JSON.stringify({ error: 'Invalid JSON payload' }), {
            status: 400,
            headers: { 'Content-Type': 'application/json' },
          });
        }

        if (!rawParsed || typeof rawParsed.message !== 'string' || typeof rawParsed.signature !== 'string') {
          return new Response(JSON.stringify({ error: 'Missing message or signature' }), {
            status: 400,
            headers: { 'Content-Type': 'application/json' },
          });
        }

        const payload = {
          message: rawParsed.message,
          signature: rawParsed.signature,
        };

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

        // Accept only nonces issued by /nonce that have not expired, once per handler instance
        const isNonceValid = await verifyStatelessDemoNonce(result.data.nonce, options.signingSecret);
        if (!isNonceValid || !consumeNonce(result.data.nonce)) {
          return new Response(JSON.stringify({ error: 'Nonce replay detected or nonce expired' }), {
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
