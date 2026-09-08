[**API Reference — @tuwaio/siwx (CAIP-122 Authentication Layer)**](../../../README.md)

***

# SiwxNonceStore

Defined in: [packages/siwx-server/src/types.ts:120](https://github.com/TuwaIO/siwx/blob/f77d0e06aaa7919c3688c2277c2d9f28269ea2b6/packages/siwx-server/src/types.ts#L120)

Durable nonce store interface for single-use nonce issuance and atomic consumption.

## Methods

### consume()

> **consume**(`input`): `Promise`\<`boolean`\>

Defined in: [packages/siwx-server/src/types.ts:133](https://github.com/TuwaIO/siwx/blob/f77d0e06aaa7919c3688c2277c2d9f28269ea2b6/packages/siwx-server/src/types.ts#L133)

Atomically consumes a nonce, guaranteeing single-use.

#### Parameters

##### input

###### nonce

`string`

The nonce string to consume.

#### Returns

`Promise`\<`boolean`\>

True if the nonce was valid and consumed, false if already consumed or expired.

***

### issue()

> **issue**(`input`): `Promise`\<`void`\>

Defined in: [packages/siwx-server/src/types.ts:126](https://github.com/TuwaIO/siwx/blob/f77d0e06aaa7919c3688c2277c2d9f28269ea2b6/packages/siwx-server/src/types.ts#L126)

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
