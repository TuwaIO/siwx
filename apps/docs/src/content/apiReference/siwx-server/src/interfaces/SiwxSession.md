[**API Reference — @tuwaio/siwx (CAIP-122 Authentication Layer)**](../../../README.md)

***

# SiwxSession

Defined in: [packages/siwx-server/src/types.ts:52](https://github.com/TuwaIO/siwx/blob/fcaa3a6f9f1375901c6bae0f335f995349246d8e/packages/siwx-server/src/types.ts#L52)

Represents a serializable session object derived from a verified CAIP-122 message.

## Properties

### address

> **address**: `string`

Defined in: [packages/siwx-server/src/types.ts:54](https://github.com/TuwaIO/siwx/blob/fcaa3a6f9f1375901c6bae0f335f995349246d8e/packages/siwx-server/src/types.ts#L54)

The verified CAIP-10 blockchain address.

***

### chainId

> **chainId**: `string`

Defined in: [packages/siwx-server/src/types.ts:56](https://github.com/TuwaIO/siwx/blob/fcaa3a6f9f1375901c6bae0f335f995349246d8e/packages/siwx-server/src/types.ts#L56)

The CAIP-2 chain ID the session is bound to.

***

### domain

> **domain**: `string`

Defined in: [packages/siwx-server/src/types.ts:58](https://github.com/TuwaIO/siwx/blob/fcaa3a6f9f1375901c6bae0f335f995349246d8e/packages/siwx-server/src/types.ts#L58)

The domain that issued the session.

***

### expirationTime?

> `optional` **expirationTime?**: `string`

Defined in: [packages/siwx-server/src/types.ts:64](https://github.com/TuwaIO/siwx/blob/fcaa3a6f9f1375901c6bae0f335f995349246d8e/packages/siwx-server/src/types.ts#L64)

ISO 8601 timestamp when the session expires, if set.

***

### issuedAt

> **issuedAt**: `string`

Defined in: [packages/siwx-server/src/types.ts:62](https://github.com/TuwaIO/siwx/blob/fcaa3a6f9f1375901c6bae0f335f995349246d8e/packages/siwx-server/src/types.ts#L62)

ISO 8601 timestamp when the session was issued.

***

### nonce

> **nonce**: `string`

Defined in: [packages/siwx-server/src/types.ts:60](https://github.com/TuwaIO/siwx/blob/fcaa3a6f9f1375901c6bae0f335f995349246d8e/packages/siwx-server/src/types.ts#L60)

The nonce that was used. Must be invalidated server-side after use.
