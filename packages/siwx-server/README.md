# `@tuwaio/siwx-server`

[![NPM Version](https://img.shields.io/npm/v/@tuwaio/siwx-server.svg)](https://www.npmjs.com/package/@tuwaio/siwx-server)
[![License](https://img.shields.io/npm/l/@tuwaio/siwx-server.svg)](./LICENSE)

> Backend utilities for `@tuwaio/siwx` (L2). Server-side CAIP-122 payload verification, durable session store abstractions, authenticated stateless demo handlers, and single-use nonce generation. Fully backend-agnostic.

---

## 🏛️ Core Capabilities

- **`verifySiwxPayload()`**: Primary server entry point. Parses the CAIP-122 message, enforces verification policy (domain, URI, allowed chains, timing windows), checks nonce replay, and dynamically verifies EVM (`siwx-evm`) or Solana (`siwx-solana`) signatures.
- **`createSiwxApiHandler()`**: Production durable session handler for Next.js App Router. Requires persistent `SiwxSessionStore` and `SiwxNonceStore` (Redis, PostgreSQL, etc.) and uses opaque session IDs in `HttpOnly` cookies.
- **`createStatelessDemoSiwxHandler()`**: Authenticated HMAC-SHA256 session handler for zero-infrastructure demonstration environments and rapid prototyping.
- **`signStatelessDemoSession()` / `verifyStatelessDemoSession()`**: Web Crypto API constant-time HMAC signing and verification for demo tokens.
- **`MemorySiwxSessionStore` / `MemorySiwxNonceStore`**: In-memory stores explicitly designated for local development and testing (fails closed in production).

---

## 💾 Installation

```bash
pnpm add @tuwaio/siwx-server @tuwaio/siwx-core
# + chain adapters (dynamically imported at runtime):
pnpm add @tuwaio/siwx-evm @tuwaio/siwx-solana
```

---

## 🛡️ Architecture Profiles

### 1. Durable Profile (Production Standard)

For production applications with user accounts, persistent logins, session revocation, and multi-replica horizontal scaling.

#### Step 1: Implement or Configure Auth Stores (`lib/authStores.ts`)

```ts
// lib/authStores.ts
import type { SiwxNonceStore, SiwxSession, SiwxSessionRecord, SiwxSessionStore } from '@tuwaio/siwx-server';
import { generateServerNonce } from '@tuwaio/siwx-server';
import Redis from 'ioredis';

const redis = new Redis(process.env.REDIS_URL || 'redis://localhost:6379');

export const sessionStore: SiwxSessionStore = {
  async create({ session, ttlSeconds }: { session: SiwxSession; ttlSeconds: number }): Promise<SiwxSessionRecord> {
    const id = generateServerNonce();
    const createdAt = Date.now();
    const expiresAt = createdAt + ttlSeconds * 1000;
    const record: SiwxSessionRecord = { id, session, createdAt, expiresAt };

    await redis.set(`siwx:session:${id}`, JSON.stringify(record), 'EX', ttlSeconds);
    return record;
  },

  async get(id: string): Promise<SiwxSessionRecord | null> {
    const data = await redis.get(`siwx:session:${id}`);
    return data ? JSON.parse(data) : null;
  },

  async bindSubject(id: string, subjectId: string): Promise<boolean> {
    const record = await this.get(id);
    if (!record) return false;
    record.subjectId = subjectId;
    const ttl = Math.max(1, Math.floor((record.expiresAt - Date.now()) / 1000));
    await redis.set(`siwx:session:${id}`, JSON.stringify(record), 'EX', ttl);
    return true;
  },

  async revoke(id: string): Promise<void> {
    await redis.del(`siwx:session:${id}`);
  },
};

export const nonceStore: SiwxNonceStore = {
  async issue({ nonce, ttlSeconds }: { nonce: string; ttlSeconds: number }): Promise<void> {
    await redis.set(`siwx:nonce:${nonce}`, '1', 'EX', ttlSeconds);
  },

  async consume({ nonce }: { nonce: string }): Promise<boolean> {
    // Atomic single-use consumption via GETDEL
    const value = await redis.getdel(`siwx:nonce:${nonce}`);
    return value !== null;
  },
};
```

#### Alternative: In-Memory Stores for Local Testing / Prototyping (No Redis Needed)

For local development or testing without spinning up Redis, you can use the built-in in-memory stores directly from `@tuwaio/siwx-server`:

```ts
// lib/authStores.dev.ts (Zero Dependencies / In-Memory)
import { MemorySiwxNonceStore, MemorySiwxSessionStore } from '@tuwaio/siwx-server';

// Built-in in-memory stores for local testing (fails closed in production by default)
export const sessionStore = new MemorySiwxSessionStore();
export const nonceStore = new MemorySiwxNonceStore();
```

Or write a custom `Map`-based storage adapter without external dependencies:

```ts
// lib/authStores.memory.ts (Custom Zero-Dependency In-Memory Store)
import type { SiwxNonceStore, SiwxSession, SiwxSessionRecord, SiwxSessionStore } from '@tuwaio/siwx-server';
import { generateServerNonce } from '@tuwaio/siwx-server';

const sessionMap = new Map<string, SiwxSessionRecord>();
const nonceMap = new Map<string, number>();

export const sessionStore: SiwxSessionStore = {
  async create({ session, ttlSeconds }: { session: SiwxSession; ttlSeconds: number }): Promise<SiwxSessionRecord> {
    const id = generateServerNonce();
    const createdAt = Date.now();
    const expiresAt = createdAt + ttlSeconds * 1000;
    const record: SiwxSessionRecord = { id, session, createdAt, expiresAt };
    sessionMap.set(id, record);
    return record;
  },

  async get(id: string): Promise<SiwxSessionRecord | null> {
    const record = sessionMap.get(id);
    if (!record || record.expiresAt < Date.now()) {
      sessionMap.delete(id);
      return null;
    }
    return record;
  },

  async bindSubject(id: string, subjectId: string): Promise<boolean> {
    const record = await this.get(id);
    if (!record) return false;
    record.subjectId = subjectId;
    return true;
  },

  async revoke(id: string): Promise<void> {
    sessionMap.delete(id);
  },
};

export const nonceStore: SiwxNonceStore = {
  async issue({ nonce, ttlSeconds }: { nonce: string; ttlSeconds: number }): Promise<void> {
    nonceMap.set(nonce, Date.now() + ttlSeconds * 1000);
  },

  async consume({ nonce }: { nonce: string }): Promise<boolean> {
    const expiresAt = nonceMap.get(nonce);
    if (!expiresAt || expiresAt < Date.now()) {
      nonceMap.delete(nonce);
      return false;
    }
    nonceMap.delete(nonce); // Atomic single-use consumption
    return true;
  },
};
```

#### Step 2: Configure the Route Handler (`app/api/siwx/[...siwx]/route.ts`)

```ts
// app/api/siwx/[...siwx]/route.ts
import { createSiwxApiHandler } from '@tuwaio/siwx-server/next';
import { nonceStore, sessionStore } from '@/lib/authStores';

const handler = createSiwxApiHandler({
  sessionStore,
  nonceStore,
  policy: {
    expectedDomain: 'app.tuwa.io',
    expectedUri: 'https://app.tuwa.io',
    allowedChainIds: ['eip155:1', 'solana:5eykt4UsFv8P8NJdTREpY1vzqKqZKvdpK'],
    maxIssuedAtAgeSeconds: 300,
  },
  cookieOptions: {
    name: 'siwx-session-v2',
    secure: process.env.NODE_ENV === 'production',
  },
});

export const { GET, POST, DELETE } = handler;
```

---

### 2. Stateless Demo Profile (Zero-Infrastructure Demonstration & Prototyping)

For sandbox environments, developer playgrounds, integration tests, or demonstration websites running without a backing database or Redis instance.

```ts
// app/api/siwx/[...siwx]/route.ts
import { createStatelessDemoSiwxHandler } from '@tuwaio/siwx-server/next';

const handler = createStatelessDemoSiwxHandler({
  signingSecret: process.env.SIWX_DEMO_SIGNING_SECRET!, // Minimum 32 characters
  policy: {
    expectedDomain: 'demo.tuwa.io',
    requireExpirationTime: true,
    maxIssuedAtAgeSeconds: 300,
    maxSessionLifetimeSeconds: 1800, // 30 minutes max session
  },
  cookieOptions: {
    name: 'siwx-demo-session',
    secure: process.env.NODE_ENV === 'production',
  },
});

export const { GET, POST, DELETE } = handler;
```

> **Warning**: Demo mode works without a database or Redis by using a short-lived stateless session. Real projects with user accounts, persistent login, logout/revoke, multi-replica deployment, and strong protection against session replay MUST connect Redis, PostgreSQL, SQLite, or another durable storage adapter.

---

## 🚀 Low-Level Manual Verification API

For custom controllers (NestJS, Fastify, Express, Cloudflare Workers):

```ts
import { toSession, verifySiwxPayload } from '@tuwaio/siwx-server';

export async function handleVerify(request: Request) {
  const { message, signature } = await request.json();

  const result = await verifySiwxPayload(
    { message, signature },
    {
      policy: {
        expectedDomain: 'app.tuwa.io',
        allowedChainIds: ['eip155:1'],
      },
    },
  );

  if (!result.success || !result.data) {
    return new Response(JSON.stringify({ error: result.error }), { status: 401 });
  }

  const session = toSession(result.data);
  return new Response(JSON.stringify(session), { status: 200 });
}
```

---

## 📦 Store Interfaces

### `SiwxSessionStore`

```ts
export interface SiwxSessionStore {
  create(input: { session: SiwxSession; ttlSeconds: number }): Promise<SiwxSessionRecord>;
  get(id: string): Promise<SiwxSessionRecord | null>;
  bindSubject(id: string, subjectId: string): Promise<boolean>;
  revoke(id: string): Promise<void>;
}
```

### `SiwxNonceStore`

```ts
export interface SiwxNonceStore {
  issue(input: { nonce: string; ttlSeconds: number }): Promise<void>;
  consume(input: { nonce: string }): Promise<boolean>;
}
```

### `SiwxSessionRecord`

```ts
export interface SiwxSessionRecord {
  id: string;
  session: SiwxSession;
  subjectId?: string;
  createdAt: number;
  expiresAt: number;
}
```

---

## 📄 License

Licensed under the **Apache-2.0 License**. See the [LICENSE](./LICENSE) file for details.
