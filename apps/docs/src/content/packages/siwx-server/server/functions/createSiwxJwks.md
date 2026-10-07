# createSiwxJwks()

> **createSiwxJwks**(`keys`): [`SiwxJwks`](/packages/siwx-server/server/interfaces/SiwxJwks.md)

Defined in: [siwx-server/src/jwtKeys.ts:150](https://github.com/TuwaIO/siwx/blob/main/packages/siwx-server/src/jwtKeys.ts#L150)

Builds the JWKS to publish: the public JWK of every key, in order, without duplicate `kid`s. Pass the current
signing key first and the keys it replaced after it, so tokens signed before a rotation keep verifying until they
expire.

## Parameters

### keys

readonly ([`SiwxPublicJwk`](/packages/siwx-server/server/interfaces/SiwxPublicJwk.md) \| [`SiwxJwtKey`](/packages/siwx-server/server/interfaces/SiwxJwtKey.md))[]

Signing keys (their public JWK is used) and/or public JWKs.

## Returns

[`SiwxJwks`](/packages/siwx-server/server/interfaces/SiwxJwks.md)

The JWKS, safe to serve publicly.
