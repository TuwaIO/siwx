# importSiwxJwtKey()

> **importSiwxJwtKey**(`params`): `Promise`\<[`SiwxJwtKey`](/packages/siwx-server/server/interfaces/SiwxJwtKey.md)\>

Defined in: [siwx-server/src/jwtKeys.ts:121](https://github.com/TuwaIO/siwx/blob/main/packages/siwx-server/src/jwtKeys.ts#L121)

Imports the private key that signs the JWTs of SIWX sessions.

Accepted forms of `privateKey`:
- a JWK object, or its JSON string (as stored by [generateSiwxJwtKey](/packages/siwx-server/server/functions/generateSiwxJwtKey.md));
- a PKCS#8 PEM (`-----BEGIN PRIVATE KEY-----`). Line breaks may be real, `\r\n` or the two characters `\n`, as
  environment variables often store them. Without `alg`, an EC P-256 key is tried first, then RSA.

The `use`, `key_ops` and `ext` members of a JWK are ignored. The imported private key is not extractable.

## Parameters

### params

The key and, optionally, the algorithm it must have.

#### alg?

[`SiwxJwtAlgorithm`](/packages/siwx-server/server/type-aliases/SiwxJwtAlgorithm.md)

The expected algorithm. Fails when the key has another one.

#### privateKey

`string` \| `JsonWebKey`

The private key as a JWK object, a JWK JSON string or a PKCS#8 PEM.

## Returns

`Promise`\<[`SiwxJwtKey`](/packages/siwx-server/server/interfaces/SiwxJwtKey.md)\>

The signing key with its public JWK and `kid` (RFC 7638 thumbprint).

## Throws

If the input is not a private key, has an unsupported type or curve, does not match `alg` or
the JWK `alg` member, is an RSA key shorter than 2048 bits, or is a PEM other than PKCS#8.
