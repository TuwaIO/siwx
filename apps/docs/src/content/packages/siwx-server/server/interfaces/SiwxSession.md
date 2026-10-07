# SiwxSession

Defined in: [siwx-server/src/types.ts:55](https://github.com/TuwaIO/siwx/blob/main/packages/siwx-server/src/types.ts#L55)

Serializable session derived from a verified CAIP-122 message (see [toSession](/packages/siwx-server/server/functions/toSession.md)). Returned as JSON by the
`verify` and `session` endpoints of `@tuwaio/siwx-server/next`.

## Properties

### address

> **address**: `string`

Defined in: [siwx-server/src/types.ts:57](https://github.com/TuwaIO/siwx/blob/main/packages/siwx-server/src/types.ts#L57)

The verified CAIP-10 blockchain address.

***

### chainId

> **chainId**: `string`

Defined in: [siwx-server/src/types.ts:59](https://github.com/TuwaIO/siwx/blob/main/packages/siwx-server/src/types.ts#L59)

The CAIP-2 chain ID the session is bound to.

***

### domain

> **domain**: `string`

Defined in: [siwx-server/src/types.ts:61](https://github.com/TuwaIO/siwx/blob/main/packages/siwx-server/src/types.ts#L61)

The domain that issued the session.

***

### expirationTime?

> `optional` **expirationTime?**: `string`

Defined in: [siwx-server/src/types.ts:67](https://github.com/TuwaIO/siwx/blob/main/packages/siwx-server/src/types.ts#L67)

ISO 8601 timestamp when the session expires, if set.

***

### issuedAt

> **issuedAt**: `string`

Defined in: [siwx-server/src/types.ts:65](https://github.com/TuwaIO/siwx/blob/main/packages/siwx-server/src/types.ts#L65)

ISO 8601 timestamp when the session was issued.

***

### nonce

> **nonce**: `string`

Defined in: [siwx-server/src/types.ts:63](https://github.com/TuwaIO/siwx/blob/main/packages/siwx-server/src/types.ts#L63)

The nonce of the signed message. It must be single-use: consume it in a [SiwxNonceStore](/packages/siwx-server/server/interfaces/SiwxNonceStore.md).
