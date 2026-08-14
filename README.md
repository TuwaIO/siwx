# @tuwaio/siwx — Sign-In With X (CAIP-122)

[![License](https://img.shields.io/badge/license-Apache--2.0-blue.svg)](./LICENSE)
[![CAIP-122](https://img.shields.io/badge/standard-CAIP--122-purple.svg)](https://github.com/ChainAgnostic/CAIPs/blob/main/CAIPs/caip-122.md)

> **TUWA Ecosystem — Low-Level Core & Adapters Layer (L1/L2).**
> A modular, multi-chain authentication library built on the [CAIP-122](https://github.com/ChainAgnostic/CAIPs/blob/main/CAIPs/caip-122.md) standard. Headless, backend-agnostic, and designed for Sovereign Individual ownership.

---

## What SIWX Enables

Modern Web3 applications require a unified, multi-chain authentication primitive. `@tuwaio/siwx` implements the [CAIP-122](https://github.com/ChainAgnostic/CAIPs/blob/main/CAIPs/caip-122.md) standard end-to-end, providing a headless, framework-agnostic foundation for off-chain authentication across EVM, Solana, and future execution environments without framework lock-in or third-party cloud dependencies.

## 🏛️ Ecosystem Layer Architecture

SIWX occupies the foundational **L1** and **L2** layers within the TUWA ecosystem:

```
L1: siwx-core       → Pure CAIP-122 Engine (zero dependencies, completely standalone)
L2: siwx adapters   → Chain Adapters (evm, solana), React store/hooks, Server utilities
L3: satellite       → Wallet Connection & Session Integration Layer
L7: nova-uikit      → UI View Layer (consumes siwx-react)
```

### Package Map

| Package                                         | Description                                                                            |
| ----------------------------------------------- | -------------------------------------------------------------------------------------- |
| [`@tuwaio/siwx-core`](./packages/siwx-core)     | Chain-agnostic CAIP-122 message builder, parser, and validator. Zero dependencies.     |
| [`@tuwaio/siwx-evm`](./packages/siwx-evm)       | EVM adapter. EIP-191 (EOA) + EIP-1271 (Smart Contract Wallets) verification.           |
| [`@tuwaio/siwx-solana`](./packages/siwx-solana) | Solana adapter. ed25519 signature verification via SubtleCrypto.                       |
| [`@tuwaio/siwx-react`](./packages/siwx-react)   | React bindings. Zustand session store + `useSiwx` / `useSiwxSession` hooks.            |
| [`@tuwaio/siwx-server`](./packages/siwx-server) | Backend utilities. Server-side verification dispatcher + cookie session serialization. |

---

## 💾 Installation

```bash
# Core only (chain-agnostic message building)
pnpm add @tuwaio/siwx-core

# EVM support
pnpm add @tuwaio/siwx-evm viem @wagmi/core

# Solana support
pnpm add @tuwaio/siwx-solana gill

# React bindings
pnpm add @tuwaio/siwx-react @tuwaio/siwx-core zustand

# Server utilities (Node.js / Edge)
pnpm add @tuwaio/siwx-server
```

### 2. Build a CAIP-122 Message

```ts
import { buildMessage, generateNonce } from '@tuwaio/siwx-core';

const message = buildMessage({
  domain: 'app.tuwa.io',
  address: 'eip155:1:0xAb5801a7D398351b8bE11C439e05C5B3259aeC9B',
  statement: 'Sign in to TUWA.',
  uri: 'https://app.tuwa.io',
  version: '1',
  chainId: 'eip155:1',
  nonce: generateNonce(),
  issuedAt: new Date().toISOString(),
  expirationTime: new Date(Date.now() + 1000 * 60 * 10).toISOString(), // 10 min
});
```

### 3. Verify on the Server

#### Option A: Production Standard (Durable Redis Session & Nonce Store)

First, define your persistent stores:

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
    const value = await redis.getdel(`siwx:nonce:${nonce}`);
    return value !== null;
  },
};
```

##### In-Memory Alternative for Local Testing / Prototyping (No Redis Needed):

```ts
// lib/authStores.dev.ts (Zero Dependencies / In-Memory)
import { MemorySiwxNonceStore, MemorySiwxSessionStore } from '@tuwaio/siwx-server';

// Built-in in-memory stores for local testing (fails closed in production by default)
export const sessionStore = new MemorySiwxSessionStore();
export const nonceStore = new MemorySiwxNonceStore();
```

Then create the Next.js App Router handler:

```ts
// app/api/siwx/[...siwx]/route.ts
import { createSiwxApiHandler } from '@tuwaio/siwx-server/next';
import { nonceStore, sessionStore } from '@/lib/authStores';

const handler = createSiwxApiHandler({
  sessionStore,
  nonceStore,
  policy: { expectedDomain: 'app.tuwa.io' },
});

export const { GET, POST, DELETE } = handler;
```

#### Option B: Stateless Demo Profile (Zero-Infrastructure Demonstration & Prototyping)

For sandbox testing, integration demos, or environments running without a database or Redis:

```ts
// app/api/siwx/[...siwx]/route.ts
import { createStatelessDemoSiwxHandler } from '@tuwaio/siwx-server/next';

const handler = createStatelessDemoSiwxHandler({
  signingSecret: process.env.SIWX_DEMO_SIGNING_SECRET!, // Minimum 32 characters
  policy: { expectedDomain: 'demo.tuwa.io', requireExpirationTime: true },
});

export const { GET, POST, DELETE } = handler;
```

### 4. Use in React

```tsx
import { useSiwx, useSiwxSession } from '@tuwaio/siwx-react';
import { createEvmSiwxSigner } from '@tuwaio/siwx-evm';
// import { createSolanaSiwxSigner } from '@tuwaio/siwx-solana';

function LoginButton({ walletClient, address }: { walletClient: any; address: string }) {
  const { signIn, signOut } = useSiwx();
  const { isAuthenticated, session } = useSiwxSession();

  const handleSignIn = async () => {
    await signIn({
      signer: createEvmSiwxSigner(walletClient),
      verifier: async (payload) => {
        const res = await fetch('/api/siwx/verify', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
        return res.ok ? res.json() : null;
      },
      fields: {
        domain: window.location.host,
        address: `eip155:1:${address}`,
        uri: window.location.origin,
        chainId: 'eip155:1',
        statement: 'Sign in to TUWA.',
      },
    });
  };

  return isAuthenticated ? (
    <div>
      <span>{session?.address}</span>
      <button onClick={signOut}>Sign Out</button>
    </div>
  ) : (
    <button onClick={handleSignIn}>Sign In</button>
  );
}
```

---

## 🚀 Architectural Usage Example

SIWX is completely headless, giving you full control over how you wire up the frontend and backend.

## Design Principles

- **Headless**: Zero UI. Brings your own components.
- **Backend-Agnostic**: `siwx-server` works with Next.js, NestJS, Hono, Express, Cloudflare Workers.
- **No State in the SDK**: `siwx-react` manages client session state independently.
- **Strict CAIP-122**: Every message is spec-compliant. Parser and builder are round-trip compatible.

---

## ⚙️ Monorepo Development

```bash
# Install dependencies
pnpm install

# Build all packages
pnpm build

# Lint
pnpm lint

# Format
pnpm format

# Generate API docs
pnpm docs:gen
```

---

## 🤝 Contribution & Auditing

Please review our ecosystem **[Contribution Guidelines](https://github.com/TuwaIO/workflows/blob/main/CONTRIBUTING.md)**.

## 📄 License

Licensed under the **Apache-2.0 License**. See the [LICENSE](./LICENSE) file for details.
