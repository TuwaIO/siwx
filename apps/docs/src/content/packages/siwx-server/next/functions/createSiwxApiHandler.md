# createSiwxApiHandler()

> **createSiwxApiHandler**(`options`): `object`

Defined in: [siwx-server/src/next.ts:159](https://github.com/TuwaIO/siwx/blob/main/packages/siwx-server/src/next.ts#L159)

Creates the SIWX route handlers of the durable (production) profile for a Next.js App Router catch-all route,
for example `app/api/siwx/[...siwx]/route.ts`. The action is taken from the last path segment:

- `GET|POST …/nonce`: issues a nonce, stores it in `nonceStore` for 300 seconds and returns `{ nonce }`.
- `POST …/verify`: accepts a JSON `{ message, signature }` of up to 64 KB, runs `verifySiwxPayload` with the
  policy, consumes the nonce (so only nonces issued by `/nonce` are accepted, once), creates a session in
  `sessionStore`, sets the session ID as an `HttpOnly` cookie and returns the `SiwxSession` JSON.
  Responds 400 for a malformed body, 401 for a failed verification or nonce, 413 for a too large body.
- `GET …/session`: returns the stored session of the cookie, or `null`.
- `DELETE …/session` or `POST …/logout`: revokes the session in the store and clears the cookie.
- `GET …/token` (with the `jwt` option): signs a JWT for the session of the cookie with `signSiwxJwt` and returns
  `{ token, expiresAt }` with `Cache-Control: no-store`. Responds 401 when there is no session or it has expired.
  The token expires after `jwt.ttlSeconds` (600 by default) and never after the session.
- `GET …/jwks` (with the `jwt` option): returns the JWKS of `jwt.signingKey` and `jwt.previousKeys` with
  `Cache-Control: public, max-age=300`. Give its URL to the services that verify the tokens.

Other paths return 404; unexpected errors are logged with `console.error` and return 500.

## Parameters

### options

[`SiwxApiHandlerOptions`](/packages/siwx-server/next/interfaces/SiwxApiHandlerOptions.md)

Stores, policy, cookie, verification and JWT options.

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

If `sessionStore` or `nonceStore` is missing.

## Throws

If `jwt.issuer` is empty.

## Throws

If `jwt.ttlSeconds` is not an integer from 1 to 604800.

## Example

```ts
// app/api/siwx/[...siwx]/route.ts
import { createSiwxApiHandler } from '@tuwaio/siwx-server/next';
import { sessionStore, nonceStore } from '@/lib/authStores';

const handler = createSiwxApiHandler({
  sessionStore,
  nonceStore,
  policy: { expectedDomain: 'app.tuwa.io' },
});

export const { GET, POST, DELETE } = handler;
```
