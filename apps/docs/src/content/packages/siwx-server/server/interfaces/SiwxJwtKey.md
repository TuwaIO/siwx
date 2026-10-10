# SiwxJwtKey

Defined in: [siwx-server/src/types.ts:327](https://github.com/TuwaIO/siwx/blob/main/packages/siwx-server/src/types.ts#L327)

A JWT signing key, created by `importSiwxJwtKey`.

## Properties

### alg

> **alg**: [`SiwxJwtAlgorithm`](/packages/siwx-server/server/type-aliases/SiwxJwtAlgorithm.md)

Defined in: [siwx-server/src/types.ts:329](https://github.com/TuwaIO/siwx/blob/main/packages/siwx-server/src/types.ts#L329)

The algorithm the key signs with.

***

### kid

> **kid**: `string`

Defined in: [siwx-server/src/types.ts:331](https://github.com/TuwaIO/siwx/blob/main/packages/siwx-server/src/types.ts#L331)

Key ID: the RFC 7638 thumbprint of the key.

***

### privateKey

> **privateKey**: `CryptoKey`

Defined in: [siwx-server/src/types.ts:333](https://github.com/TuwaIO/siwx/blob/main/packages/siwx-server/src/types.ts#L333)

The private key. Not extractable, usable only to sign.

***

### publicJwk

> **publicJwk**: [`SiwxPublicJwk`](/packages/siwx-server/server/interfaces/SiwxPublicJwk.md)

Defined in: [siwx-server/src/types.ts:335](https://github.com/TuwaIO/siwx/blob/main/packages/siwx-server/src/types.ts#L335)

The public key to publish in the JWKS.
