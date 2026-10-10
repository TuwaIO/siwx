# signSiwxJwt()

> **signSiwxJwt**(`params`): `Promise`\<\{ `expiresAt`: `number`; `token`: `string`; \}\>

Defined in: [siwx-server/src/jwt.ts:101](https://github.com/TuwaIO/siwx/blob/main/packages/siwx-server/src/jwt.ts#L101)

Signs a JWT for a SIWX session with ES256 or RS256 (Web Crypto API).

The header is `{ alg, kid, typ: "JWT" }`. The claims are `iss`, `sub`, `aud` (when set), `iat`, `exp`, `jti` (16
random bytes), `caip10` and `chain_id` (with Solana chain IDs in their genesis-hash form), plus `claims`. `exp` is
the earliest of `now + ttlSeconds`, `notAfter` and the `expirationTime` of the signed message, so a token never
outlives its session.

Side effects: reads the clock (unless `now` is set) and the random number generator.

## Parameters

### params

The session, the key and the claims.

#### audience?

`string` \| `string`[]

The `aud` claim, when the receiving service expects one.

#### claims?

`Record`\<`string`, `unknown`\>

Extra claims. `iss`, `sub`, `aud`, `iat`, `exp`, `nbf`, `jti`, `caip10` and `chain_id` are
reserved.

#### issuer

`string`

The `iss` claim: the URL of your app. The receiving service checks it.

#### key

[`SiwxJwtKey`](/packages/siwx-server/server/interfaces/SiwxJwtKey.md)

The signing key, from `importSiwxJwtKey`.

#### notAfter?

`number`

Latest expiry in milliseconds since the epoch, for example the expiry of the session record.

#### now?

`number`

Current time in milliseconds since the epoch. Defaults to `Date.now()`.

#### session

[`SiwxSession`](/packages/siwx-server/server/interfaces/SiwxSession.md)

The verified session of the signed-in wallet.

#### subject?

`string`

The `sub` claim. Defaults to [siwxJwtSubject](/packages/siwx-server/server/functions/siwxJwtSubject.md) of the session.

#### ttlSeconds?

`number`

Token lifetime in seconds, from 1 to 604800 (7 days). Defaults to 600.

## Returns

`Promise`\<\{ `expiresAt`: `number`; `token`: `string`; \}\>

The compact JWT and its expiry in milliseconds since the epoch.

## Throws

If `issuer` is empty, `claims` sets a reserved claim or the session address is not a CAIP-10
account ID.

## Throws

If `ttlSeconds` is not an integer from 1 to 604800, or the session expires within the current
second.

## Example

```ts
const { token } = await signSiwxJwt({ session, key, issuer: 'https://app.example.com' });
```
