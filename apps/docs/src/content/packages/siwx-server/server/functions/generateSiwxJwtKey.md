# generateSiwxJwtKey()

> **generateSiwxJwtKey**(`alg?`): `Promise`\<\{ `kid`: `string`; `privateJwk`: `JsonWebKey`; `publicJwk`: [`SiwxPublicJwk`](/packages/siwx-server/server/interfaces/SiwxPublicJwk.md); \}\>

Defined in: [siwx-server/src/jwtKeys.ts:85](https://github.com/TuwaIO/siwx/blob/main/packages/siwx-server/src/jwtKeys.ts#L85)

Generates a new JWT signing key. Run it once, store `privateJwk` as a secret (for example the environment variable
read by [importSiwxJwtKey](/packages/siwx-server/server/functions/importSiwxJwtKey.md)) and never expose it to the browser.

## Parameters

### alg?

[`SiwxJwtAlgorithm`](/packages/siwx-server/server/type-aliases/SiwxJwtAlgorithm.md) = `'ES256'`

`ES256` (P-256, default) or `RS256` (2048-bit modulus, exponent 65537).

## Returns

`Promise`\<\{ `kid`: `string`; `privateJwk`: `JsonWebKey`; `publicJwk`: [`SiwxPublicJwk`](/packages/siwx-server/server/interfaces/SiwxPublicJwk.md); \}\>

The private JWK to store, the public JWK and its `kid`.
