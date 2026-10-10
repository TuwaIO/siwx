# SiwxPublicJwk

Defined in: [siwx-server/src/types.ts:303](https://github.com/TuwaIO/siwx/blob/main/packages/siwx-server/src/types.ts#L303)

Public JSON Web Key of a JWT signing key, as published in a JWKS (see [SiwxJwks](/packages/siwx-server/server/interfaces/SiwxJwks.md)). Holds no private members.

## Properties

### alg

> **alg**: [`SiwxJwtAlgorithm`](/packages/siwx-server/server/type-aliases/SiwxJwtAlgorithm.md)

Defined in: [siwx-server/src/types.ts:317](https://github.com/TuwaIO/siwx/blob/main/packages/siwx-server/src/types.ts#L317)

The algorithm the key signs with.

***

### crv?

> `optional` **crv?**: `"P-256"`

Defined in: [siwx-server/src/types.ts:307](https://github.com/TuwaIO/siwx/blob/main/packages/siwx-server/src/types.ts#L307)

Curve of an EC key. Always `P-256`.

***

### e?

> `optional` **e?**: `string`

Defined in: [siwx-server/src/types.ts:315](https://github.com/TuwaIO/siwx/blob/main/packages/siwx-server/src/types.ts#L315)

Public exponent of an RSA key, base64url.

***

### kid

> **kid**: `string`

Defined in: [siwx-server/src/types.ts:319](https://github.com/TuwaIO/siwx/blob/main/packages/siwx-server/src/types.ts#L319)

Key ID: the RFC 7638 thumbprint of the key. Written into the `kid` header of every token the key signs.

***

### kty

> **kty**: `"EC"` \| `"RSA"`

Defined in: [siwx-server/src/types.ts:305](https://github.com/TuwaIO/siwx/blob/main/packages/siwx-server/src/types.ts#L305)

Key type: `EC` for ES256, `RSA` for RS256.

***

### n?

> `optional` **n?**: `string`

Defined in: [siwx-server/src/types.ts:313](https://github.com/TuwaIO/siwx/blob/main/packages/siwx-server/src/types.ts#L313)

Modulus of an RSA key, base64url.

***

### use

> **use**: `"sig"`

Defined in: [siwx-server/src/types.ts:321](https://github.com/TuwaIO/siwx/blob/main/packages/siwx-server/src/types.ts#L321)

Public key use. Always `sig`.

***

### x?

> `optional` **x?**: `string`

Defined in: [siwx-server/src/types.ts:309](https://github.com/TuwaIO/siwx/blob/main/packages/siwx-server/src/types.ts#L309)

x coordinate of an EC key, base64url.

***

### y?

> `optional` **y?**: `string`

Defined in: [siwx-server/src/types.ts:311](https://github.com/TuwaIO/siwx/blob/main/packages/siwx-server/src/types.ts#L311)

y coordinate of an EC key, base64url.
