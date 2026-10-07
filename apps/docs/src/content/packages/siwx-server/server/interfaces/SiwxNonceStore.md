# SiwxNonceStore

Defined in: [siwx-server/src/types.ts:130](https://github.com/TuwaIO/siwx/blob/main/packages/siwx-server/src/types.ts#L130)

Storage contract for single-use challenge nonces, used by `createSiwxApiHandler`. Implementations must be shared
by every server instance and `consume` must be atomic (for example Redis `GETDEL`).
[MemorySiwxNonceStore](/packages/siwx-server/server/classes/MemorySiwxNonceStore.md) is an in-memory implementation for development and tests.

## Methods

### consume()

> **consume**(`input`): `Promise`\<`boolean`\>

Defined in: [siwx-server/src/types.ts:146](https://github.com/TuwaIO/siwx/blob/main/packages/siwx-server/src/types.ts#L146)

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

Defined in: [siwx-server/src/types.ts:138](https://github.com/TuwaIO/siwx/blob/main/packages/siwx-server/src/types.ts#L138)

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
