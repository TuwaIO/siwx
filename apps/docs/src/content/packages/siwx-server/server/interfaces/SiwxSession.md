# SiwxSession

Defined in: [siwx-server/src/types.ts:70](https://github.com/TuwaIO/siwx/blob/main/packages/siwx-server/src/types.ts#L70)

Serializable session derived from a verified CAIP-122 message (see [toSession](/packages/siwx-server/server/functions/toSession.md)). Returned as JSON by the
`verify` and `session` endpoints of `@tuwaio/siwx-server/next`.

## Properties

### address

> **address**: `string`

Defined in: [siwx-server/src/types.ts:72](https://github.com/TuwaIO/siwx/blob/main/packages/siwx-server/src/types.ts#L72)

The verified CAIP-10 blockchain address.

***

### chainId

> **chainId**: `string`

Defined in: [siwx-server/src/types.ts:74](https://github.com/TuwaIO/siwx/blob/main/packages/siwx-server/src/types.ts#L74)

The CAIP-2 chain ID the session is bound to.

***

### domain

> **domain**: `string`

Defined in: [siwx-server/src/types.ts:76](https://github.com/TuwaIO/siwx/blob/main/packages/siwx-server/src/types.ts#L76)

The domain that issued the session.

***

### expirationTime?

> `optional` **expirationTime?**: `string`

Defined in: [siwx-server/src/types.ts:82](https://github.com/TuwaIO/siwx/blob/main/packages/siwx-server/src/types.ts#L82)

ISO 8601 timestamp when the session expires, if set.

***

### issuedAt

> **issuedAt**: `string`

Defined in: [siwx-server/src/types.ts:80](https://github.com/TuwaIO/siwx/blob/main/packages/siwx-server/src/types.ts#L80)

ISO 8601 timestamp when the session was issued.

***

### nonce

> **nonce**: `string`

Defined in: [siwx-server/src/types.ts:78](https://github.com/TuwaIO/siwx/blob/main/packages/siwx-server/src/types.ts#L78)

The nonce of the signed message. It must be single-use: consume it in a [SiwxNonceStore](/packages/siwx-server/server/interfaces/SiwxNonceStore.md).

***

### verificationMethod?

> `optional` **verificationMethod?**: [`SiwxVerificationMethod`](/packages/siwx-server/server/type-aliases/SiwxVerificationMethod.md)

Defined in: [siwx-server/src/types.ts:88](https://github.com/TuwaIO/siwx/blob/main/packages/siwx-server/src/types.ts#L88)

How the signature was verified (see [SiwxVerificationMethod](/packages/siwx-server/server/type-aliases/SiwxVerificationMethod.md)). Set by `createSiwxApiHandler`; in your own
handlers, pass `result.method` of [verifySiwxPayload](/packages/siwx-server/server/functions/verifySiwxPayload.md) to [toSession](/packages/siwx-server/server/functions/toSession.md). [siwxJwtSubject](/packages/siwx-server/server/functions/siwxJwtSubject.md) reads
it: without it, the subject of an EVM session keeps its chain.
