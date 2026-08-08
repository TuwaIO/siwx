[**API Reference — @tuwaio/siwx (CAIP-122 Authentication Layer)**](../../../README.md)

***

# SiwxSession

Defined in: [packages/siwx-server/src/types.ts:48](https://github.com/TuwaIO/siwx/blob/25e4a0067650f7a94ad6029e68a5c6fc790192ab/packages/siwx-server/src/types.ts#L48)

Represents a serializable session object derived from a verified CAIP-122 message.
This can be stored in a cookie or JWT payload.

## Properties

### address

> **address**: `string`

Defined in: [packages/siwx-server/src/types.ts:50](https://github.com/TuwaIO/siwx/blob/25e4a0067650f7a94ad6029e68a5c6fc790192ab/packages/siwx-server/src/types.ts#L50)

The verified CAIP-10 blockchain address.

***

### chainId

> **chainId**: `string`

Defined in: [packages/siwx-server/src/types.ts:52](https://github.com/TuwaIO/siwx/blob/25e4a0067650f7a94ad6029e68a5c6fc790192ab/packages/siwx-server/src/types.ts#L52)

The CAIP-2 chain ID the session is bound to.

***

### domain

> **domain**: `string`

Defined in: [packages/siwx-server/src/types.ts:54](https://github.com/TuwaIO/siwx/blob/25e4a0067650f7a94ad6029e68a5c6fc790192ab/packages/siwx-server/src/types.ts#L54)

The domain that issued the session.

***

### expirationTime?

> `optional` **expirationTime?**: `string`

Defined in: [packages/siwx-server/src/types.ts:60](https://github.com/TuwaIO/siwx/blob/25e4a0067650f7a94ad6029e68a5c6fc790192ab/packages/siwx-server/src/types.ts#L60)

ISO 8601 timestamp when the session expires, if set.

***

### issuedAt

> **issuedAt**: `string`

Defined in: [packages/siwx-server/src/types.ts:58](https://github.com/TuwaIO/siwx/blob/25e4a0067650f7a94ad6029e68a5c6fc790192ab/packages/siwx-server/src/types.ts#L58)

ISO 8601 timestamp when the session was issued.

***

### nonce

> **nonce**: `string`

Defined in: [packages/siwx-server/src/types.ts:56](https://github.com/TuwaIO/siwx/blob/25e4a0067650f7a94ad6029e68a5c6fc790192ab/packages/siwx-server/src/types.ts#L56)

The nonce that was used. Must be invalidated server-side after use.
