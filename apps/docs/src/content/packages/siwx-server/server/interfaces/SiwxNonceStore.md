# SiwxNonceStore

Defined in: [siwx-server/src/types.ts:128](https://github.com/TuwaIO/siwx/blob/main/packages/siwx-server/src/types.ts#L128)

Storage contract for single-use challenge nonces, used by `createSiwxApiHandler`. Implementations must be shared
by every server instance and `consume` must be atomic (for example Redis `GETDEL`).
[MemorySiwxNonceStore](/packages/siwx-server/server/classes/MemorySiwxNonceStore.md) is an in-memory implementation for development and tests.

## Methods

### consume()

> **consume**(`input`): `Promise`\<`boolean`\>

Defined in: [siwx-server/src/types.ts:144](https://github.com/TuwaIO/siwx/blob/main/packages/siwx-server/src/types.ts#L144)

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

***

### issue()

> **issue**(`input`): `Promise`\<`void`\>

Defined in: [siwx-server/src/types.ts:136](https://github.com/TuwaIO/siwx/blob/main/packages/siwx-server/src/types.ts#L136)

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
