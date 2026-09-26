# createStatelessDemoSiwxHandler()

> **createStatelessDemoSiwxHandler**(`options`): `object`

Defined in: [siwx-server/src/next.ts:339](https://github.com/TuwaIO/siwx/blob/main/packages/siwx-server/src/next.ts#L339)

Creates the SIWX route handlers of the stateless demo profile for a Next.js App Router catch-all route. The
session is an HMAC-signed token in an `HttpOnly` cookie (see [signStatelessDemoSession](/packages/siwx-server/server/functions/signStatelessDemoSession.md)), so no database or
Redis is needed. Intended for demos and prototypes only.

- `GET|POST …/nonce`: returns `{ nonce }`, a nonce signed with the secret and valid for 300 seconds (see
  [issueStatelessDemoNonce](/packages/siwx-server/server/functions/issueStatelessDemoNonce.md)). Nothing is stored.
- `POST …/verify`: accepts a JSON `{ message, signature }` (size limit from `demoLimits`), runs
  `verifySiwxPayload` with the policy, accepts the message nonce only if it was issued by `/nonce`, has not
  expired and has not been used before on this server instance, sets the signed token as the session cookie and
  returns the `SiwxSession` JSON. Responds 400, 401 or 413 like the durable handler.
- `GET …/session`: verifies the cookie token and returns the session, or `null`.
- `DELETE …/session` or `POST …/logout`: clears the cookie.

Security limits: used nonces are remembered in the memory of each server instance only, so with several instances
a signed message can be replayed on another instance within the 300-second nonce lifetime; tokens cannot be
revoked before they expire. Keep `requireExpirationTime` and a short `maxSessionLifetimeSeconds`.

Side effects: keeps the used nonces of this handler in memory until they expire.

## Parameters

### options

[`StatelessDemoSiwxHandlerOptions`](/packages/siwx-server/next/interfaces/StatelessDemoSiwxHandlerOptions.md)

Signing secret, policy, cookie, limits and verification options.

## Returns

`object`

Route handlers to export as `GET`, `POST` and `DELETE`.

### DELETE

> **DELETE**: (`req`) => `Promise`\<`Response`\> = `universalHandler`

#### Parameters

##### req

`Request`

#### Returns

`Promise`\<`Response`\>

### GET

> **GET**: (`req`) => `Promise`\<`Response`\> = `universalHandler`

#### Parameters

##### req

`Request`

#### Returns

`Promise`\<`Response`\>

### POST

> **POST**: (`req`) => `Promise`\<`Response`\> = `universalHandler`

#### Parameters

##### req

`Request`

#### Returns

`Promise`\<`Response`\>

## Throws

If `signingSecret` is missing or shorter than 32 characters.

## Example

```ts
// app/api/siwx/[...siwx]/route.ts
import { createStatelessDemoSiwxHandler } from '@tuwaio/siwx-server/next';

const handler = createStatelessDemoSiwxHandler({
  signingSecret: process.env.SIWX_DEMO_SIGNING_SECRET!,
  policy: {
    expectedDomain: 'tuwa.io',
    requireExpirationTime: true,
  },
});

export const { GET, POST, DELETE } = handler;
```
