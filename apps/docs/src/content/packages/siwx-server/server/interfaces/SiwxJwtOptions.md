# SiwxJwtOptions

Defined in: [siwx-server/src/types.ts:330](https://github.com/TuwaIO/siwx/blob/main/packages/siwx-server/src/types.ts#L330)

The `jwt` option of `createSiwxApiHandler` (`@tuwaio/siwx-server/next`): enables `GET …/token` (a fresh JWT for
the session cookie) and `GET …/jwks` (the public keys).

## Properties

### audience?

> `optional` **audience?**: `string` \| `string`[]

Defined in: [siwx-server/src/types.ts:344](https://github.com/TuwaIO/siwx/blob/main/packages/siwx-server/src/types.ts#L344)

The `aud` claim, when the receiving service expects one.

***

### claims?

> `optional` **claims?**: (`record`) => `Record`\<`string`, `unknown`\> \| `Promise`\<`Record`\<`string`, `unknown`\>\>

Defined in: [siwx-server/src/types.ts:356](https://github.com/TuwaIO/siwx/blob/main/packages/siwx-server/src/types.ts#L356)

Extra claims from the session record. Reserved claims cannot be set.

#### Parameters

##### record

[`SiwxSessionRecord`](/packages/siwx-server/server/interfaces/SiwxSessionRecord.md)

#### Returns

`Record`\<`string`, `unknown`\> \| `Promise`\<`Record`\<`string`, `unknown`\>\>

***

### issuer

> **issuer**: `string`

Defined in: [siwx-server/src/types.ts:342](https://github.com/TuwaIO/siwx/blob/main/packages/siwx-server/src/types.ts#L342)

The `iss` claim: the URL of your app.

***

### previousKeys?

> `optional` **previousKeys?**: readonly ([`SiwxPublicJwk`](/packages/siwx-server/server/interfaces/SiwxPublicJwk.md) \| [`SiwxJwtKey`](/packages/siwx-server/server/interfaces/SiwxJwtKey.md))[]

Defined in: [siwx-server/src/types.ts:340](https://github.com/TuwaIO/siwx/blob/main/packages/siwx-server/src/types.ts#L340)

Keys replaced by `signingKey`, published in the JWKS so that tokens they signed keep verifying until they
expire. Signing keys or public JWKs.

***

### signingKey

> **signingKey**: [`SiwxJwtKey`](/packages/siwx-server/server/interfaces/SiwxJwtKey.md) \| `Promise`\<[`SiwxJwtKey`](/packages/siwx-server/server/interfaces/SiwxJwtKey.md)\>

Defined in: [siwx-server/src/types.ts:335](https://github.com/TuwaIO/siwx/blob/main/packages/siwx-server/src/types.ts#L335)

The key that signs the tokens, from `importSiwxJwtKey`. A promise is accepted, so the route file needs no
top-level `await`; an import error then surfaces as a 500 on the first `/token` or `/jwks` request.

***

### subject?

> `optional` **subject?**: (`record`) => `string` \| `Promise`\<`string`\>

Defined in: [siwx-server/src/types.ts:354](https://github.com/TuwaIO/siwx/blob/main/packages/siwx-server/src/types.ts#L354)

Builds the `sub` claim from the session record. Defaults to the bound `subjectId`, otherwise the account without
its chain (see `siwxJwtSubject`).

#### Parameters

##### record

[`SiwxSessionRecord`](/packages/siwx-server/server/interfaces/SiwxSessionRecord.md)

#### Returns

`string` \| `Promise`\<`string`\>

***

### ttlSeconds?

> `optional` **ttlSeconds?**: `number`

Defined in: [siwx-server/src/types.ts:349](https://github.com/TuwaIO/siwx/blob/main/packages/siwx-server/src/types.ts#L349)

Token lifetime in seconds, from 1 to 604800 (7 days). A token never outlives its session.

#### Default

```ts
600
```
