[**API Reference — @tuwaio/siwx (CAIP-122 Authentication Layer)**](../../../README.md)

***

# MemorySiwxNonceStore

Defined in: [packages/siwx-server/src/server.ts:385](https://github.com/TuwaIO/siwx/blob/3e92d2c12c74ad4820f3f675f56b978c23099c12/packages/siwx-server/src/server.ts#L385)

In-memory implementation of SiwxNonceStore.
STRICTLY for local development, prototyping, and unit testing.
Fails closed in production environments.

## Implements

- [`SiwxNonceStore`](../interfaces/SiwxNonceStore.md)

## Constructors

### Constructor

> **new MemorySiwxNonceStore**(`options?`): `MemorySiwxNonceStore`

Defined in: [packages/siwx-server/src/server.ts:388](https://github.com/TuwaIO/siwx/blob/3e92d2c12c74ad4820f3f675f56b978c23099c12/packages/siwx-server/src/server.ts#L388)

#### Parameters

##### options?

###### allowInProduction?

`boolean`

#### Returns

`MemorySiwxNonceStore`

## Methods

### consume()

> **consume**(`input`): `Promise`\<`boolean`\>

Defined in: [packages/siwx-server/src/server.ts:404](https://github.com/TuwaIO/siwx/blob/3e92d2c12c74ad4820f3f675f56b978c23099c12/packages/siwx-server/src/server.ts#L404)

Atomically consumes a nonce, guaranteeing single-use.

#### Parameters

##### input

###### nonce

`string`

The nonce string to consume.

#### Returns

`Promise`\<`boolean`\>

True if the nonce was valid and consumed, false if already consumed or expired.

#### Implementation of

[`SiwxNonceStore`](../interfaces/SiwxNonceStore.md).[`consume`](../interfaces/SiwxNonceStore.md#consume)

***

### issue()

> **issue**(`input`): `Promise`\<`void`\>

Defined in: [packages/siwx-server/src/server.ts:399](https://github.com/TuwaIO/siwx/blob/3e92d2c12c74ad4820f3f675f56b978c23099c12/packages/siwx-server/src/server.ts#L399)

Issues and stores a new challenge nonce with TTL.

#### Parameters

##### input

###### nonce

`string`

The unique nonce string.

###### ttlSeconds

`number`

Time-to-live in seconds (typically 300s).

#### Returns

`Promise`\<`void`\>

#### Implementation of

[`SiwxNonceStore`](../interfaces/SiwxNonceStore.md).[`issue`](../interfaces/SiwxNonceStore.md#issue)
