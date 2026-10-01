# @tuwaio/siwx-server

[![NPM Version](https://img.shields.io/npm/v/@tuwaio/siwx-server.svg)](https://www.npmjs.com/package/@tuwaio/siwx-server)
[![License](https://img.shields.io/npm/l/@tuwaio/siwx-server.svg)](https://github.com/TuwaIO/siwx/blob/main/packages/siwx-server/LICENSE)

`@tuwaio/siwx-server` is the server Layer 2 (L2) package of **SIWX** (Sign-In With X), the authentication project of TUWA Stage 1 ("Core Auth & Primitives", next to Orbit Utils). Built on **`@tuwaio/siwx-core`** and the Web platform APIs (`Request`, `Response`, Web Crypto), it verifies signed CAIP-122 messages for EVM and Solana on your backend, issues single-use nonces and sessions through pluggable stores, and formats the session cookie. It runs on Node.js 20+ and does not depend on a web framework, a database or a hosted service.

It has two entry points:

- `@tuwaio/siwx-server`: framework-agnostic verification, session and cookie utilities.
- `@tuwaio/siwx-server/next`: ready-made route handlers for a Next.js App Router catch-all route. They use only `Request` and `Response`, so they do not import `next`.

---

## 🏛️ Core Capabilities

- **Verification:** `verifySiwxPayload` parses the message, validates it against your `SiwxVerificationPolicy` and routes the signature check by chain to `@tuwaio/siwx-evm` (EIP-191, with an EIP-1271 fallback when `publicClient` is set) or `@tuwaio/siwx-solana` (ed25519). It returns a result instead of throwing.
- **Durable profile:** `createSiwxApiHandler` serves the nonce, verify, session and logout routes on top of your `SiwxSessionStore` and `SiwxNonceStore` (Redis, SQL, KV…), with the session ID in an `HttpOnly` cookie.
- **Stateless demo profile:** `createStatelessDemoSiwxHandler` issues HMAC-signed nonces and keeps the session in an HMAC-signed cookie, for demos without a database.
- **Server-side session:** `getSiwxServerSession` reads the session from a `Request`, `Headers`, a `Cookie` header or the Next.js `cookies()` store, for Server Actions and API routes.
- **Building blocks:** `MemorySiwxSessionStore` and `MemorySiwxNonceStore` for development and tests, cookie helpers, demo token and demo nonce signing, and re-exports of the `@tuwaio/siwx-core` validators.

---

## 💾 Installation

```bash
pnpm add @tuwaio/siwx-server @tuwaio/siwx-core

# Chain verifiers, loaded at runtime for the chains you accept:
pnpm add @tuwaio/siwx-evm viem @wagmi/core
pnpm add @tuwaio/siwx-solana @solana/kit @wallet-standard/base
```

> [!IMPORTANT]
> `@tuwaio/siwx-core` is a required peer dependency. `@tuwaio/siwx-evm`, `@tuwaio/siwx-solana` and `viem` are optional peer dependencies: `verifySiwxPayload` imports the chain package dynamically, depending on the chain of the message, so install the ones you accept together with their own peer dependencies. A message for a chain whose package is missing fails verification. `viem` provides the `PublicClient` type of the EIP-1271 option.

---

## 🚀 Usage

### 1. Session and nonce stores

The durable profile needs a session store and a nonce store shared by every server instance. A Redis implementation (the client shape matches `ioredis`):

```typescript
// lib/authStores.ts
import {
  generateServerNonce,
  type SiwxNonceStore,
  type SiwxSessionRecord,
  type SiwxSessionStore,
} from '@tuwaio/siwx-server';

declare const redis: {
  set(key: string, value: string, mode: 'EX', seconds: number): Promise<unknown>;
  get(key: string): Promise<string | null>;
  getdel(key: string): Promise<string | null>;
  del(key: string): Promise<unknown>;
};

export const sessionStore: SiwxSessionStore = {
  async create({ session, ttlSeconds }) {
    const createdAt = Date.now();
    const record: SiwxSessionRecord = {
      id: generateServerNonce(), // 128-bit random ID, becomes the cookie value
      session,
      createdAt,
      expiresAt: createdAt + ttlSeconds * 1000,
    };
    await redis.set(`siwx:session:${record.id}`, JSON.stringify(record), 'EX', ttlSeconds);
    return record;
  },
  async get(id) {
    const data = await redis.get(`siwx:session:${id}`); // expired keys are removed by Redis
    return data ? (JSON.parse(data) as SiwxSessionRecord) : null;
  },
  async bindSubject(id, subjectId) {
    const record = await this.get(id);
    if (!record) return false;
    const ttlSeconds = Math.max(1, Math.floor((record.expiresAt - Date.now()) / 1000));
    await redis.set(`siwx:session:${id}`, JSON.stringify({ ...record, subjectId }), 'EX', ttlSeconds);
    return true;
  },
  async revoke(id) {
    await redis.del(`siwx:session:${id}`);
  },
};

export const nonceStore: SiwxNonceStore = {
  async issue({ nonce, ttlSeconds }) {
    await redis.set(`siwx:nonce:${nonce}`, '1', 'EX', ttlSeconds);
  },
  async consume({ nonce }) {
    return (await redis.getdel(`siwx:nonce:${nonce}`)) !== null; // atomic: each nonce is accepted once
  },
};
```

For local development and tests, use `new MemorySiwxSessionStore()` and `new MemorySiwxNonceStore()`. They keep data in the memory of one process and throw when `NODE_ENV` is `production`, unless you pass `{ allowInProduction: true }`.

### 2. Route handlers (Next.js App Router)

```typescript
// app/api/siwx/[...siwx]/route.ts
import { createSiwxApiHandler } from '@tuwaio/siwx-server/next';

import { nonceStore, sessionStore } from '@/lib/authStores';

export const { GET, POST, DELETE } = createSiwxApiHandler({
  sessionStore,
  nonceStore,
  policy: {
    expectedDomain: 'app.tuwa.io',
    expectedUri: 'https://app.tuwa.io',
    allowedChainIds: ['eip155:1', 'solana:5eykt4UsFv8P8NJdTREpY1vzqKqZKvdpK'],
    requireExpirationTime: true,
    maxIssuedAtAgeSeconds: 300,
  },
  ttlSeconds: 7 * 24 * 60 * 60, // session and cookie lifetime (default)
});
```

The handler picks the action from the last path segment:

| Route               | Method       | Behavior                                                                                                                          |
| ------------------- | ------------ | --------------------------------------------------------------------------------------------------------------------------------- |
| `/api/siwx/nonce`   | `GET` `POST` | Issues a nonce, stores it for 300 seconds, returns `{ nonce }`                                                                    |
| `/api/siwx/verify`  | `POST`       | Verifies `{ message, signature }` (max 64 KB), consumes the nonce, creates the session, sets the cookie, returns the session JSON |
| `/api/siwx/session` | `GET`        | Returns the session of the cookie, or `null`                                                                                      |
| `/api/siwx/session` | `DELETE`     | Revokes the session and clears the cookie                                                                                         |
| `/api/siwx/logout`  | `POST`       | Same as `DELETE /api/siwx/session`                                                                                                |

`POST /verify` responds with 400 for a malformed body, 401 when verification or the nonce check fails, and 413 for a body over 64 KB. On the client, fetch the nonce from `/api/siwx/nonce` (the `getNonce` option of `useSiwx` in [`@tuwaio/siwx-react`](https://siwx.docs.tuwa.io/packages/siwx-react)): the handler only accepts nonces it has issued.

### 3. Reading the session on the server

```typescript
// app/actions/updateProfile.ts
'use server';

import { getSiwxServerSession, isSessionMatchingTarget } from '@tuwaio/siwx-server';
import { cookies } from 'next/headers';

import { sessionStore } from '@/lib/authStores';

export async function updateProfile(address: string) {
  const session = await getSiwxServerSession({ cookieSource: await cookies(), sessionStore });

  if (!session || !isSessionMatchingTarget(session, address)) {
    throw new Error('Unauthorized');
  }

  // The request is made by the owner of `address`.
}
```

`cookieSource` also accepts a `Request`, a `Headers` object or a `Cookie` header string, so the same call works in any framework.

### 4. Stateless demo profile

```typescript
// app/api/siwx/[...siwx]/route.ts
import { createStatelessDemoSiwxHandler } from '@tuwaio/siwx-server/next';

const signingSecret = process.env.SIWX_DEMO_SIGNING_SECRET; // server-only, at least 32 characters
if (!signingSecret) throw new Error('SIWX_DEMO_SIGNING_SECRET is not set');
const appUrl = new URL(process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000'); // the origin users open

export const { GET, POST, DELETE } = createStatelessDemoSiwxHandler({
  signingSecret,
  policy: {
    expectedDomain: appUrl.host,
    expectedUri: appUrl.origin,
    requireExpirationTime: true,
    maxIssuedAtAgeSeconds: 300,
    maxSessionLifetimeSeconds: 30 * 60,
  },
});
```

The routes are the same as in the durable profile, without a database:

- `/nonce` returns a nonce signed with `signingSecret` and valid for 300 seconds. `/verify` accepts only such nonces, and only once: used nonces are remembered in the memory of the server instance until they expire. As with the durable profile, the client must fetch the nonce (`getNonce` in `useSiwx`).
- The session is an HMAC-SHA256 signed token in the cookie. It expires with the message `expirationTime` (or after `ttlSeconds`, 30 minutes by default). With `maxSessionLifetimeSeconds: 1800`, set `fields.expirationTime` on the client to at most 30 minutes: `useSiwx` defaults to 24 hours.

> [!WARNING]
> With several server instances (or serverless functions), each one remembers its own used nonces, so a signed message can be replayed on another instance within the 300-second nonce lifetime. A token stays valid until it expires, even after logout, and it is signed, not encrypted. Use the demo profile only for demos and prototypes, with a short `maxSessionLifetimeSeconds`.

### 5. Other frameworks

```typescript
import {
  createSessionCookie,
  type SiwxNonceStore,
  type SiwxSessionStore,
  toSession,
  verifySiwxPayload,
} from '@tuwaio/siwx-server';

declare const nonceStore: SiwxNonceStore;
declare const sessionStore: SiwxSessionStore;

export async function handleVerify(request: Request): Promise<Response> {
  const { message, signature } = (await request.json()) as { message: string; signature: string };

  const result = await verifySiwxPayload(
    { message, signature },
    { policy: { expectedDomain: 'app.tuwa.io', requireExpirationTime: true } },
  );
  if (!result.success || !result.data) return Response.json({ error: result.error }, { status: 401 });

  // Accept only nonces issued by your nonce endpoint, once.
  if (!(await nonceStore.consume({ nonce: result.data.nonce }))) {
    return Response.json({ error: 'Invalid nonce' }, { status: 401 });
  }

  const record = await sessionStore.create({ session: toSession(result.data), ttlSeconds: 7 * 24 * 60 * 60 });
  return Response.json(record.session, { headers: { 'Set-Cookie': createSessionCookie(record.id) } });
}
```

---

## 🛡️ Security Notes

- **Nonce:** a signature proves ownership only if its nonce is fresh. Both handlers accept a nonce only if it was issued by `/nonce` in the last 300 seconds, and only once. The durable handler consumes it in your `SiwxNonceStore`, whose `consume` must be atomic and shared by every instance; the demo handler checks the nonce signature and remembers used nonces per instance. `verifySiwxPayload` alone checks nothing but the optional `usedNonces` set.
- **Domain and URI:** without `policy.expectedDomain`, a message signed for another site is accepted. Always set `expectedDomain` (case-insensitive exact match) and, if possible, `expectedUri` (same origin or a sub-path).
- **Expiry:** messages are rejected once their `expirationTime` has passed, with the same `clockSkewSeconds` tolerance as the other timing rules (60 seconds by default; set `0` for none). Set `requireExpirationTime`, `maxSessionLifetimeSeconds` and `maxIssuedAtAgeSeconds`; the last one has no default, so stale messages are accepted until you set it. Durable sessions expire through the store: `SiwxSessionStore.get` must return `null` for expired records.
- **Chains:** `allowedChainIds` entries are full CAIP-2 IDs matched exactly, both when a message is verified and in `getSiwxServerSession`, so `eip155:1` never allows `solana:1`.
- **Server-side checks:** `getSiwxServerSession` applies only `expectedDomain` and `allowedChainIds` of its `policy`, plus `requireExpirationTime` for durable sessions and the token expiry for demo sessions. The full policy runs when the message is verified.
- **Cookies:** the session cookie is always `HttpOnly`, and `Secure` and `SameSite=Strict` by default. Keep `secure: true` in production.
- **Secrets:** the demo `signingSecret` must be at least 32 characters and must never reach the browser. Changing it invalidates every demo session.

---

## 🌐 External Services

The package contacts no hosts of its own. With `verifyOptions.publicClient` (or `publicClient` in `verifySiwxPayload`), the EIP-1271 fallback sends one `eth_call` to the RPC endpoint of that client. Sessions and nonces go only to the stores you provide.

---

## 📚 API Reference

Every export, with signatures and types generated from the source, is documented at **[siwx.docs.tuwa.io/packages/siwx-server](https://siwx.docs.tuwa.io/packages/siwx-server)**: the `server` module for `@tuwaio/siwx-server` and the `next` module for `@tuwaio/siwx-server/next`.

## 📄 License

Licensed under the **Apache-2.0 License**. See the [LICENSE](https://github.com/TuwaIO/siwx/blob/main/packages/siwx-server/LICENSE) file for details.

## Modules

- [server](/packages/siwx-server/server)
- [next](/packages/siwx-server/next)
