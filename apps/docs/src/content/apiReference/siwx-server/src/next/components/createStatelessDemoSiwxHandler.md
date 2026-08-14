[**API Reference — @tuwaio/siwx (CAIP-122 Authentication Layer)**](../../../../README.md)

***

# createStatelessDemoSiwxHandler()

> **createStatelessDemoSiwxHandler**(`options`): `object`

Defined in: [packages/siwx-server/src/next.ts:267](https://github.com/TuwaIO/siwx/blob/bbc740ccb7f405b75bd0d4e5a1bc973b1e131514/packages/siwx-server/src/next.ts#L267)

Creates a stateless demo Next.js App Router route handler for SIWX.
Uses authenticated HMAC-SHA256 tokens in HttpOnly cookies without requiring Redis or a database.

Intended STRICTLY for zero-infrastructure demonstration apps and website prototypes.

## Parameters

### options

[`StatelessDemoSiwxHandlerOptions`](../interfaces/StatelessDemoSiwxHandlerOptions.md)

Configuration including server signingSecret, policy, and demoLimits.

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
