[**API Reference — @tuwaio/siwx (CAIP-122 Authentication Layer)**](../../../README.md)

***

# MemorySiwxNonceStore

Defined in: [packages/siwx-server/src/server.ts:386](https://github.com/TuwaIO/siwx/blob/21b3a05b39d40806567e8859c0d7699b6b50336c/packages/siwx-server/src/server.ts#L386)

In-memory implementation of SiwxNonceStore.
STRICTLY for local development, prototyping, and unit testing.
Fails closed in production environments.

## Implements

- [`SiwxNonceStore`](../interfaces/SiwxNonceStore.md)

## Constructors

### Constructor

> **new MemorySiwxNonceStore**(`options?`): `MemorySiwxNonceStore`

Defined in: [packages/siwx-server/src/server.ts:389](https://github.com/TuwaIO/siwx/blob/21b3a05b39d40806567e8859c0d7699b6b50336c/packages/siwx-server/src/server.ts#L389)

#### Parameters

##### options?

###### allowInProduction?

`boolean`

#### Returns

`MemorySiwxNonceStore`

## Methods

### consume()

> **consume**(`input`): `Promise`\<`boolean`\>

Defined in: [packages/siwx-server/src/server.ts:405](https://github.com/TuwaIO/siwx/blob/21b3a05b39d40806567e8859c0d7699b6b50336c/packages/siwx-server/src/server.ts#L405)

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

Defined in: [packages/siwx-server/src/server.ts:400](https://github.com/TuwaIO/siwx/blob/21b3a05b39d40806567e8859c0d7699b6b50336c/packages/siwx-server/src/server.ts#L400)

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
