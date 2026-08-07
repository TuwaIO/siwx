/**
 * @fileoverview Next.js App Router (Route Handlers) API helper for SIWX.
 */

import { deserializeCookieSession, serializeCookieSession, toSession, verifySiwxPayload } from './server';
import { CookieOptions, ServerVerifyOptions } from './types';

export interface SiwxApiHandlerOptions {
  /**
   * Options for cookie serialization.
   */
  cookieOptions?: CookieOptions;
  /**
   * Options for server-side payload verification (e.g. nonce replays, public client).
   */
  verifyOptions?: ServerVerifyOptions;
}

/**
 * Creates a ready-to-use Next.js App Router route handler for SIWX operations.
 * Exposes GET, POST, and DELETE methods that handle session verification, fetching, and logout.
 *
 * Works purely with the standard Web `Request` and `Response` objects natively
 * supported by Next.js Route Handlers.
 *
 * @param options - Optional configuration for cookies and verification.
 * @returns An object with `GET`, `POST`, and `DELETE` handlers.
 *
 * @example
 * ```ts
 * // app/api/siwx/[...siwx]/route.ts
 * import { createSiwxApiHandler } from '@tuwaio/siwx-server/next';
 *
 * const handler = createSiwxApiHandler();
 * export const { GET, POST, DELETE } = handler;
 * ```
 */
export function createSiwxApiHandler(options: SiwxApiHandlerOptions = {}) {
  const cookieName = options.cookieOptions?.name || 'siwx-session';

  /**
   * Universal handler that routes requests based on the URL path.
   */
  const universalHandler = async (req: Request) => {
    try {
      // Determine action from URL path segments or context params (for Next.js catch-all routes)
      let action = '';

      // Since context is a promise in Next.js 15+, we should await it if it's a promise, but for compatibility
      // with older versions we check if it has a .then. Actually, context is passed synchronously in Next 13-14,
      // but in Next 15 `context.params` is a promise.
      // To be safe, we rely on the URL parsing which is foolproof and framework agnostic.
      const url = new URL(req.url);
      const pathParts = url.pathname.split('/').filter(Boolean);
      action = pathParts[pathParts.length - 1] || '';

      // 1. GET /session -> Return current session
      if (req.method === 'GET' && action === 'session') {
        const cookieHeader = req.headers.get('cookie') || '';
        const cookies = Object.fromEntries(
          cookieHeader
            .split('; ')
            .filter(Boolean)
            .map((c) => {
              const parts = c.split('=');
              return [parts[0].trim(), parts.slice(1).join('=')];
            }),
        );
        const sessionCookie = cookies[cookieName];

        if (!sessionCookie) {
          return new Response(JSON.stringify(null), {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
          });
        }

        const session = deserializeCookieSession(sessionCookie);
        return new Response(JSON.stringify(session), {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
        });
      }

      // 2. POST /verify -> Validate payload and create session
      if (req.method === 'POST' && action === 'verify') {
        const payload = await req.json();

        if (!payload.message || !payload.signature) {
          return new Response(JSON.stringify({ error: 'Missing message or signature' }), {
            status: 400,
            headers: { 'Content-Type': 'application/json' },
          });
        }

        const result = await verifySiwxPayload(payload, options.verifyOptions);

        if (!result.success) {
          return new Response(JSON.stringify({ error: result.error }), {
            status: 401,
            headers: { 'Content-Type': 'application/json' },
          });
        }

        // Successfully verified, issue session cookie
        if (!result.data) {
          return new Response(JSON.stringify({ error: 'Verification succeeded but returned no data' }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' },
          });
        }

        const { cookieHeader, session } = serializeCookieSession(toSession(result.data), options.cookieOptions);

        return new Response(JSON.stringify(session), {
          status: 200,
          headers: {
            'Content-Type': 'application/json',
            'Set-Cookie': cookieHeader,
          },
        });
      }

      // 3. DELETE /session (or POST /logout) -> Destroy session
      if ((req.method === 'DELETE' && action === 'session') || (req.method === 'POST' && action === 'logout')) {
        return new Response(JSON.stringify({ success: true }), {
          status: 200,
          headers: {
            'Content-Type': 'application/json',
            'Set-Cookie': `${cookieName}=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT; HttpOnly; SameSite=Strict`,
          },
        });
      }

      return new Response(JSON.stringify({ error: 'Not Found' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' },
      });
    } catch (error) {
      console.error('[SIWX-SERVER] API Handler error:', error);
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
