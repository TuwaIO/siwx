# MemorySiwxNonceStore

Defined in: [siwx-server/src/server.ts:459](https://github.com/TuwaIO/siwx/blob/main/packages/siwx-server/src/server.ts#L459)

In-memory [SiwxNonceStore](/packages/siwx-server/server/interfaces/SiwxNonceStore.md) for local development and tests. Nonces live in a `Map` of the current process:
they are lost on restart and not shared between instances or serverless invocations, so a nonce issued by one
instance is rejected by another.

## Implements

- [`SiwxNonceStore`](/packages/siwx-server/server/interfaces/SiwxNonceStore.md)

## Constructors

### Constructor

> **new MemorySiwxNonceStore**(`options?`): `MemorySiwxNonceStore`

Defined in: [siwx-server/src/server.ts:467](https://github.com/TuwaIO/siwx/blob/main/packages/siwx-server/src/server.ts#L467)

#### Parameters

##### options?

Store options.

###### allowInProduction?

`boolean`

Allows the store when `NODE_ENV` is `production`.

#### Returns

`MemorySiwxNonceStore`

#### Throws

When `process.env.NODE_ENV` is `production` and `allowInProduction` is not `true`.

## Methods

### consume()

> **consume**(`input`): `Promise`\<`boolean`\>

Defined in: [siwx-server/src/server.ts:483](https://github.com/TuwaIO/siwx/blob/main/packages/siwx-server/src/server.ts#L483)

Atomically removes a nonce, so that each nonce is accepted once.

#### Parameters

##### input

The nonce to consume.

###### nonce

`string`

The nonce string to consume.

#### Returns

`Promise`\<`boolean`\>

`true` if the nonce was issued, not expired and not consumed before; otherwise `false`.

#### Implementation of

[`SiwxNonceStore`](/packages/siwx-server/server/interfaces/SiwxNonceStore.md).[`consume`](/packages/siwx-server/server/interfaces/SiwxNonceStore.md#consume)

***

### issue()

> **issue**(`input`): `Promise`\<`void`\>

Defined in: [siwx-server/src/server.ts:478](https://github.com/TuwaIO/siwx/blob/main/packages/siwx-server/src/server.ts#L478)

Stores a newly issued nonce.

#### Parameters

##### input

The nonce to store.

###### nonce

`string`

The nonce string.

###### ttlSeconds

`number`

Time-to-live in seconds. `createSiwxApiHandler` uses 300.

#### Returns

`Promise`\<`void`\>

A promise that resolves once the nonce is stored.

#### Implementation of

[`SiwxNonceStore`](/packages/siwx-server/server/interfaces/SiwxNonceStore.md).[`issue`](/packages/siwx-server/server/interfaces/SiwxNonceStore.md#issue)
