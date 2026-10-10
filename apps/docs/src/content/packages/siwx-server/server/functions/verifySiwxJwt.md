# verifySiwxJwt()

> **verifySiwxJwt**(`token`, `params`): `Promise`\<[`SiwxJwtPayload`](/packages/siwx-server/server/interfaces/SiwxJwtPayload.md) \| `null`\>

Defined in: [siwx-server/src/jwt.ts:181](https://github.com/TuwaIO/siwx/blob/main/packages/siwx-server/src/jwt.ts#L181)

Verifies a JWT issued by [signSiwxJwt](/packages/siwx-server/server/functions/signSiwxJwt.md), for services that receive the token instead of the session cookie.

Checks, in order: three base64url parts with JSON header and payload; header `alg` is `ES256` or `RS256` (`none` is
rejected), `typ` is `JWT` when present and `kid` is present; a key with that `kid` exists in `jwks` and has the
same algorithm; the signature; `iss` equals `issuer`; `aud` contains one of `audience` when `audience` is set;
`exp` has not passed and `iat` is not in the future, both with `clockSkewSeconds`; `sub` is a non-empty string.

Never throws: every failure returns `null`. Side effects: reads the clock unless `now` is set.

## Parameters

### token

`string`

The compact JWT.

### params

The keys and the expected claims.

#### audience?

`string` \| `string`[]

The expected audience. When set, the token must carry an `aud` containing one of them.

#### clockSkewSeconds?

`number`

Tolerance for `exp` and `iat` in seconds. Defaults to 60.

#### issuer

`string`

The expected `iss`.

#### jwks

[`SiwxJwks`](/packages/siwx-server/server/interfaces/SiwxJwks.md) \| readonly ([`SiwxPublicJwk`](/packages/siwx-server/server/interfaces/SiwxPublicJwk.md) \| [`SiwxJwtKey`](/packages/siwx-server/server/interfaces/SiwxJwtKey.md))[] \| \{ `keys`: readonly `JsonWebKey`[]; \}

The JWKS (as served by `/jwks` or built with `createSiwxJwks`), or an array of signing keys
and/or public JWKs.

#### now?

`number`

Current time in milliseconds since the epoch. Defaults to `Date.now()`.

## Returns

`Promise`\<[`SiwxJwtPayload`](/packages/siwx-server/server/interfaces/SiwxJwtPayload.md) \| `null`\>

The claims of a valid token, or `null`.

## Example

```ts
const jwks = await (await fetch('https://app.example.com/api/siwx/jwks')).json();
const claims = await verifySiwxJwt(token, { jwks, issuer: 'https://app.example.com' });
if (!claims) return new Response('Unauthorized', { status: 401 });
```
