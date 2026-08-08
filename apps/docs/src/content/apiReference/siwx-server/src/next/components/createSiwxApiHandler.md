[**API Reference — @tuwaio/siwx (CAIP-122 Authentication Layer)**](../../../../README.md)

***

# createSiwxApiHandler()

> **createSiwxApiHandler**(`options?`): `object`

Defined in: [packages/siwx-server/src/next.ts:38](https://github.com/TuwaIO/siwx/blob/25e4a0067650f7a94ad6029e68a5c6fc790192ab/packages/siwx-server/src/next.ts#L38)

Creates a ready-to-use Next.js App Router route handler for SIWX operations.
Exposes GET, POST, and DELETE methods that handle session verification, fetching, and logout.

Works purely with the standard Web `Request` and `Response` objects natively
supported by Next.js Route Handlers.

## Parameters

### options?

[`SiwxApiHandlerOptions`](../interfaces/SiwxApiHandlerOptions.md) = `{}`

Optional configuration for cookies and verification.

## Returns

An object with `GET`, `POST`, and `DELETE` handlers.

### DELETE

> **DELETE**: (`req`) => `Promise`\<`Response`\> = `universalHandler`

Universal handler that routes requests based on the URL path.

#### Parameters

##### req

`Request`

#### Returns

`Promise`\<`Response`\>

### GET

> **GET**: (`req`) => `Promise`\<`Response`\> = `universalHandler`

Universal handler that routes requests based on the URL path.

#### Parameters

##### req

`Request`

#### Returns

`Promise`\<`Response`\>

### POST

> **POST**: (`req`) => `Promise`\<`Response`\> = `universalHandler`

Universal handler that routes requests based on the URL path.

#### Parameters

##### req

`Request`

#### Returns

`Promise`\<`Response`\>

## Example

```ts
// app/api/siwx/[...siwx]/route.ts
import { createSiwxApiHandler } from '@tuwaio/siwx-server/next';

const handler = createSiwxApiHandler();
export const { GET, POST, DELETE } = handler;
```
