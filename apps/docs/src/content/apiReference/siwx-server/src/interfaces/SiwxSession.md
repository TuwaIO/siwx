[**API Reference — @tuwaio/siwx (CAIP-122 Authentication Layer)**](../../../README.md)

***

# SiwxSession

Defined in: [packages/siwx-server/src/types.ts:42](https://github.com/TuwaIO/siwx/blob/09eb108718ca0fbc6fd96fa980ed6a900a00adb2/packages/siwx-server/src/types.ts#L42)

Represents a serializable session object derived from a verified CAIP-122 message.
This can be stored in a cookie or JWT payload.

## Properties

### address

> **address**: `string`

Defined in: [packages/siwx-server/src/types.ts:44](https://github.com/TuwaIO/siwx/blob/09eb108718ca0fbc6fd96fa980ed6a900a00adb2/packages/siwx-server/src/types.ts#L44)

The verified CAIP-10 blockchain address.

***

### chainId

> **chainId**: `string`

Defined in: [packages/siwx-server/src/types.ts:46](https://github.com/TuwaIO/siwx/blob/09eb108718ca0fbc6fd96fa980ed6a900a00adb2/packages/siwx-server/src/types.ts#L46)

The CAIP-2 chain ID the session is bound to.

***

### domain

> **domain**: `string`

Defined in: [packages/siwx-server/src/types.ts:48](https://github.com/TuwaIO/siwx/blob/09eb108718ca0fbc6fd96fa980ed6a900a00adb2/packages/siwx-server/src/types.ts#L48)

The domain that issued the session.

***

### expirationTime?

> `optional` **expirationTime?**: `string`

Defined in: [packages/siwx-server/src/types.ts:54](https://github.com/TuwaIO/siwx/blob/09eb108718ca0fbc6fd96fa980ed6a900a00adb2/packages/siwx-server/src/types.ts#L54)

ISO 8601 timestamp when the session expires, if set.

***

### issuedAt

> **issuedAt**: `string`

Defined in: [packages/siwx-server/src/types.ts:52](https://github.com/TuwaIO/siwx/blob/09eb108718ca0fbc6fd96fa980ed6a900a00adb2/packages/siwx-server/src/types.ts#L52)

ISO 8601 timestamp when the session was issued.

***

### nonce

> **nonce**: `string`

Defined in: [packages/siwx-server/src/types.ts:50](https://github.com/TuwaIO/siwx/blob/09eb108718ca0fbc6fd96fa980ed6a900a00adb2/packages/siwx-server/src/types.ts#L50)

The nonce that was used. Must be invalidated server-side after use.
