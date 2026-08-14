[**API Reference — @tuwaio/siwx (CAIP-122 Authentication Layer)**](../../../README.md)

***

# getSiwxServerSession()

> **getSiwxServerSession**(`options`): `Promise`\<[`SiwxSession`](../interfaces/SiwxSession.md) \| `null`\>

Defined in: [packages/siwx-server/src/server.ts:434](https://github.com/TuwaIO/siwx/blob/fcaa3a6f9f1375901c6bae0f335f995349246d8e/packages/siwx-server/src/server.ts#L434)

Resolves and verifies an active SIWX session strictly on the server side.
Supports both durable session stores and stateless HMAC-signed demo cookies.

## Parameters

### options

[`GetSiwxServerSessionOptions`](../interfaces/GetSiwxServerSessionOptions.md)

Configuration including cookieSource, sessionStore or signingSecret, and optional policy.

## Returns

`Promise`\<[`SiwxSession`](../interfaces/SiwxSession.md) \| `null`\>

The verified `SiwxSession` object, or `null` if invalid, expired, or absent.

## Example

```ts
// In Next.js Server Actions:
import { cookies } from 'next/headers';
import { getSiwxServerSession } from '@tuwaio/siwx-server';
import { sessionStore } from '@/lib/authStores';

const session = await getSiwxServerSession({
  cookieSource: await cookies(),
  sessionStore,
});
```
