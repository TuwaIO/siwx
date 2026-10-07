# getSiwxServerSession()

> **getSiwxServerSession**(`options`): `Promise`\<[`SiwxSession`](/packages/siwx-server/server/interfaces/SiwxSession.md) \| `null`\>

Defined in: [siwx-server/src/server.ts:518](https://github.com/TuwaIO/siwx/blob/main/packages/siwx-server/src/server.ts#L518)

Reads the SIWX session of the current request from its session cookie. Use it in Server Actions, Route Handlers
or any server code instead of trusting session data sent by the client.

With `sessionStore`, the cookie value is a session ID looked up with `sessionStore.get` (which enforces
expiry). Otherwise, with `signingSecret`, it is a demo token verified with [verifyStatelessDemoSession](/packages/siwx-server/server/functions/verifyStatelessDemoSession.md).
See [GetSiwxServerSessionOptions](/packages/siwx-server/server/interfaces/GetSiwxServerSessionOptions.md) for the accepted cookie sources and the policy checks.

## Parameters

### options

[`GetSiwxServerSessionOptions`](/packages/siwx-server/server/interfaces/GetSiwxServerSessionOptions.md)

Cookie source, store or secret, and optional policy.

## Returns

`Promise`\<[`SiwxSession`](/packages/siwx-server/server/interfaces/SiwxSession.md) \| `null`\>

The session, or `null` when there is no cookie, no store or secret, or the session is unknown, expired or
rejected by the policy.

## Throws

Errors thrown by `sessionStore.get` are not caught.

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
