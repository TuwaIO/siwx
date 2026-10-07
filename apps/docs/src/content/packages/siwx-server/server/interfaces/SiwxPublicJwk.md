# SiwxPublicJwk

Defined in: [siwx-server/src/types.ts:282](https://github.com/TuwaIO/siwx/blob/main/packages/siwx-server/src/types.ts#L282)

Public JSON Web Key of a JWT signing key, as published in a JWKS (see [SiwxJwks](/packages/siwx-server/server/interfaces/SiwxJwks.md)). Holds no private members.

## Properties

### alg

> **alg**: [`SiwxJwtAlgorithm`](/packages/siwx-server/server/type-aliases/SiwxJwtAlgorithm.md)

Defined in: [siwx-server/src/types.ts:296](https://github.com/TuwaIO/siwx/blob/main/packages/siwx-server/src/types.ts#L296)

The algorithm the key signs with.

***

### crv?

> `optional` **crv?**: `"P-256"`

Defined in: [siwx-server/src/types.ts:286](https://github.com/TuwaIO/siwx/blob/main/packages/siwx-server/src/types.ts#L286)

Curve of an EC key. Always `P-256`.

***

### e?

> `optional` **e?**: `string`

Defined in: [siwx-server/src/types.ts:294](https://github.com/TuwaIO/siwx/blob/main/packages/siwx-server/src/types.ts#L294)

Public exponent of an RSA key, base64url.

***

### kid

> **kid**: `string`

Defined in: [siwx-server/src/types.ts:298](https://github.com/TuwaIO/siwx/blob/main/packages/siwx-server/src/types.ts#L298)

Key ID: the RFC 7638 thumbprint of the key. Written into the `kid` header of every token the key signs.

***

### kty

> **kty**: `"EC"` \| `"RSA"`

Defined in: [siwx-server/src/types.ts:284](https://github.com/TuwaIO/siwx/blob/main/packages/siwx-server/src/types.ts#L284)

Key type: `EC` for ES256, `RSA` for RS256.

***

### n?

> `optional` **n?**: `string`

Defined in: [siwx-server/src/types.ts:292](https://github.com/TuwaIO/siwx/blob/main/packages/siwx-server/src/types.ts#L292)

Modulus of an RSA key, base64url.

***

### use

> **use**: `"sig"`

Defined in: [siwx-server/src/types.ts:300](https://github.com/TuwaIO/siwx/blob/main/packages/siwx-server/src/types.ts#L300)

Public key use. Always `sig`.

***

### x?

> `optional` **x?**: `string`

Defined in: [siwx-server/src/types.ts:288](https://github.com/TuwaIO/siwx/blob/main/packages/siwx-server/src/types.ts#L288)

x coordinate of an EC key, base64url.

***

### y?

> `optional` **y?**: `string`

Defined in: [siwx-server/src/types.ts:290](https://github.com/TuwaIO/siwx/blob/main/packages/siwx-server/src/types.ts#L290)

y coordinate of an EC key, base64url.
