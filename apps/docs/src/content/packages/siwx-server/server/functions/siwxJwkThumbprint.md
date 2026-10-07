# siwxJwkThumbprint()

> **siwxJwkThumbprint**(`jwk`): `Promise`\<`string`\>

Defined in: [siwx-server/src/jwtKeys.ts:65](https://github.com/TuwaIO/siwx/blob/main/packages/siwx-server/src/jwtKeys.ts#L65)

Computes the RFC 7638 thumbprint of a key: SHA-256 over the required public members in lexicographic order
(`crv`, `kty`, `x`, `y` for EC; `e`, `kty`, `n` for RSA), base64url. SIWX uses it as the `kid` of a key.

## Parameters

### jwk

[`SiwxPublicJwk`](/packages/siwx-server/server/interfaces/SiwxPublicJwk.md) \| `JsonWebKey`

A public or private JWK of an EC or RSA key.

## Returns

`Promise`\<`string`\>

The thumbprint, 43 base64url characters.

## Throws

If the key is neither EC nor RSA, or a required member is missing.
