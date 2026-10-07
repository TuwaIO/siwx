# SiwxJwtKey

Defined in: [siwx-server/src/types.ts:306](https://github.com/TuwaIO/siwx/blob/main/packages/siwx-server/src/types.ts#L306)

A JWT signing key, created by `importSiwxJwtKey`.

## Properties

### alg

> **alg**: [`SiwxJwtAlgorithm`](/packages/siwx-server/server/type-aliases/SiwxJwtAlgorithm.md)

Defined in: [siwx-server/src/types.ts:308](https://github.com/TuwaIO/siwx/blob/main/packages/siwx-server/src/types.ts#L308)

The algorithm the key signs with.

***

### kid

> **kid**: `string`

Defined in: [siwx-server/src/types.ts:310](https://github.com/TuwaIO/siwx/blob/main/packages/siwx-server/src/types.ts#L310)

Key ID: the RFC 7638 thumbprint of the key.

***

### privateKey

> **privateKey**: `CryptoKey`

Defined in: [siwx-server/src/types.ts:312](https://github.com/TuwaIO/siwx/blob/main/packages/siwx-server/src/types.ts#L312)

The private key. Not extractable, usable only to sign.

***

### publicJwk

> **publicJwk**: [`SiwxPublicJwk`](/packages/siwx-server/server/interfaces/SiwxPublicJwk.md)

Defined in: [siwx-server/src/types.ts:314](https://github.com/TuwaIO/siwx/blob/main/packages/siwx-server/src/types.ts#L314)

The public key to publish in the JWKS.
