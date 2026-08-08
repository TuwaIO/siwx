# `@tuwaio/siwx-server`

[![NPM Version](https://img.shields.io/npm/v/@tuwaio/siwx-server.svg)](https://www.npmjs.com/package/@tuwaio/siwx-server)
[![License](https://img.shields.io/npm/l/@tuwaio/siwx-server.svg)](./LICENSE)

> Backend utilities for `@tuwaio/siwx` (L2). Server-side CAIP-122 payload verification, session serialization, and nonce generation. Fully backend-agnostic — works with any framework.

---

## Responsibility

- **`verifySiwxPayload()`**: The primary server entry point. Parses the CAIP-122 message, validates all fields, checks for nonce replay attacks, and dynamically dispatches to the correct chain verifier (`siwx-evm` or `siwx-solana`) based on the CAIP-2 namespace.
- **`serializeCookieSession()`**: Generates a complete `Set-Cookie` header string with an `HttpOnly` session.
- **`deserializeCookieSession()`**: Reads and deserializes a session from a cookie value.
- **`generateServerNonce()`**: A convenience re-export of `generateNonce` from `siwx-core` for generating nonces server-side.

---

## Installation

```bash
pnpm add @tuwaio/siwx-server @tuwaio/siwx-core
# + chain adapters (auto-imported dynamically):
pnpm add @tuwaio/siwx-evm @tuwaio/siwx-solana
```

---

## API

### `createSiwxApiHandler(options?)` (Next.js App Router)

A ready-to-use Next.js Route Handler for handling the full SIWX lifecycle (`/verify`, `/session`, `/logout`). It works purely with standard Web `Request`/`Response` APIs, keeping your backend fast and edge-compatible.

```ts
// app/api/siwx/[...siwx]/route.ts
import { createSiwxApiHandler } from '@tuwaio/siwx-server/next';

const handler = createSiwxApiHandler({
  cookieOptions: {
    name: 'tuwa-auth',
    secure: process.env.NODE_ENV === 'production',
  },
  // Optional: Pass used nonces to prevent replay attacks
  verifyOptions: {
    // usedNonces: await getNonceStore()
  },
});

// Automatically exposes GET, POST, and DELETE methods
export const { GET, POST, DELETE } = handler;
```

---

## Manual Verification API

If you aren't using Next.js or prefer full control, you can use the low-level utilities.

### `verifySiwxPayload(payload, options?): Promise<ServerVerifyResult>`

The main server-side verification entry point. Chain is detected automatically from the CAIP-2 `chainId` in the message. Accepts optional `options?: ServerVerifyOptions` (`usedNonces?: Set<string>`, `skipExpiration?: boolean`).

```ts
import { verifySiwxPayload, serializeCookieSession, toSession } from '@tuwaio/siwx-server';

// In a Next.js API Route or NestJS Controller:
export async function POST(request: Request) {
  const { message, signature } = await request.json();

  const result = await verifySiwxPayload(
    { message, signature },
    { usedNonces: await getNonceStore() }, // pass your consumed nonces set
  );

  if (!result.success) {
    return new Response(result.error, { status: 401 });
  }

  // Session is valid — issue cookie
  const { cookieHeader } = serializeCookieSession(toSession(result.data!));
  return new Response('OK', {
    headers: { 'Set-Cookie': cookieHeader },
  });
}
```

### `serializeCookieSession(session, opts?): SerializedCookieSession`

Serializes a `SiwxSession` into a `Set-Cookie` header string.

```ts
import { serializeCookieSession } from '@tuwaio/siwx-server';

const { cookieHeader } = serializeCookieSession(session, {
  name: 'tuwa-auth',
  maxAge: 60 * 60 * 24 * 7, // 7 days
  secure: true,
  sameSite: 'Strict',
});
```

### `deserializeCookieSession(cookieValue): SiwxSession | null`

Reads and parses a session from a cookie value (the inverse of `serializeCookieSession`).

```ts
import { deserializeCookieSession } from '@tuwaio/siwx-server';

const cookie = request.cookies.get('tuwa-auth')?.value;
const session = deserializeCookieSession(cookie ?? '');
if (!session) throw new Error('No valid session');
```

### `generateServerNonce(): string`

Generates a secure nonce for sending to the client. Store it in Redis or your DB before sending.

```ts
import { generateServerNonce } from '@tuwaio/siwx-server';

const nonce = generateServerNonce();
await redis.set(`nonce:${nonce}`, '1', 'EX', 300); // expires in 5 min
```

### `toSession(parsed: ParsedSiwxMessage): SiwxSession`

Converts a `ParsedSiwxMessage` into a lean `SiwxSession` object.

```ts
import { toSession } from '@tuwaio/siwx-server';

const session = toSession(parsedMessage);
```

### `isSessionMatchingTarget(session, targetAddress, targetChainId?)`

Re-exported from `@tuwaio/siwx-core` for server-side authorization checks. Validates if a session matches a target account address and optional chainId.

```ts
import { isSessionMatchingTarget } from '@tuwaio/siwx-server';

const isValid = isSessionMatchingTarget(session, userAddress, chainId);
```

---

## Nonce Replay Protection

Always invalidate used nonces after verification:

```ts
const result = await verifySiwxPayload(
  { message, signature },
  {
    usedNonces: new Set(await redis.smembers('used_nonces')),
  },
);

if (result.success) {
  // Mark nonce as consumed
  await redis.sadd('used_nonces', result.data!.nonce);
  await redis.expire('used_nonces', 86400); // cleanup after 24h
}
```

---

## Peer Dependencies

| Package             | Version       |
| ------------------- | ------------- |
| `@tuwaio/siwx-core` | `workspace:*` |

Chain adapters are dynamically imported at runtime — only install the ones you need.

---

## 📄 License

Licensed under the **Apache-2.0 License**. See the [LICENSE](./LICENSE) file for details.
