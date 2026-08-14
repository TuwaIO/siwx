[**API Reference — @tuwaio/siwx (CAIP-122 Authentication Layer)**](../../../../README.md)

***

# createSiwxApiHandler()

> **createSiwxApiHandler**(`options`): `object`

Defined in: [packages/siwx-server/src/next.ts:113](https://github.com/TuwaIO/siwx/blob/fcaa3a6f9f1375901c6bae0f335f995349246d8e/packages/siwx-server/src/next.ts#L113)

Creates a standard production Next.js App Router route handler for SIWX with durable storage.
Requires persistent session and nonce stores (Redis, PostgreSQL, etc.).

## Parameters

### options

[`SiwxApiHandlerOptions`](../interfaces/SiwxApiHandlerOptions.md)

Configuration including sessionStore, nonceStore, and policy.

## Returns

`object`

Object with `GET`, `POST`, and `DELETE` HTTP route handlers.

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
