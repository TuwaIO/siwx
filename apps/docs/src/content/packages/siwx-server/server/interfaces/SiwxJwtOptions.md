# SiwxJwtOptions

Defined in: [siwx-server/src/types.ts:351](https://github.com/TuwaIO/siwx/blob/main/packages/siwx-server/src/types.ts#L351)

The `jwt` option of `createSiwxApiHandler` (`@tuwaio/siwx-server/next`): enables `GET …/token` (a fresh JWT for
the session cookie) and `GET …/jwks` (the public keys).

## Properties

### audience?

> `optional` **audience?**: `string` \| `string`[]

Defined in: [siwx-server/src/types.ts:365](https://github.com/TuwaIO/siwx/blob/main/packages/siwx-server/src/types.ts#L365)

The `aud` claim, when the receiving service expects one.

***

### claims?

> `optional` **claims?**: (`record`) => `Record`\<`string`, `unknown`\> \| `Promise`\<`Record`\<`string`, `unknown`\>\>

Defined in: [siwx-server/src/types.ts:378](https://github.com/TuwaIO/siwx/blob/main/packages/siwx-server/src/types.ts#L378)

Extra claims from the session record. Reserved claims cannot be set.

#### Parameters

##### record

[`SiwxSessionRecord`](/packages/siwx-server/server/interfaces/SiwxSessionRecord.md)

#### Returns

`Record`\<`string`, `unknown`\> \| `Promise`\<`Record`\<`string`, `unknown`\>\>

***

### issuer

> **issuer**: `string`

Defined in: [siwx-server/src/types.ts:363](https://github.com/TuwaIO/siwx/blob/main/packages/siwx-server/src/types.ts#L363)

The `iss` claim: the URL of your app.

***

### previousKeys?

> `optional` **previousKeys?**: readonly ([`SiwxPublicJwk`](/packages/siwx-server/server/interfaces/SiwxPublicJwk.md) \| [`SiwxJwtKey`](/packages/siwx-server/server/interfaces/SiwxJwtKey.md))[]

Defined in: [siwx-server/src/types.ts:361](https://github.com/TuwaIO/siwx/blob/main/packages/siwx-server/src/types.ts#L361)

Keys replaced by `signingKey`, published in the JWKS so that tokens they signed keep verifying until they
expire. Signing keys or public JWKs.

***

### signingKey

> **signingKey**: [`SiwxJwtKey`](/packages/siwx-server/server/interfaces/SiwxJwtKey.md) \| `Promise`\<[`SiwxJwtKey`](/packages/siwx-server/server/interfaces/SiwxJwtKey.md)\>

Defined in: [siwx-server/src/types.ts:356](https://github.com/TuwaIO/siwx/blob/main/packages/siwx-server/src/types.ts#L356)

The key that signs the tokens, from `importSiwxJwtKey`. A promise is accepted, so the route file needs no
top-level `await`; an import error then surfaces as a 500 on the first `/token` or `/jwks` request.

***

### subject?

> `optional` **subject?**: (`record`) => `string` \| `Promise`\<`string`\>

Defined in: [siwx-server/src/types.ts:376](https://github.com/TuwaIO/siwx/blob/main/packages/siwx-server/src/types.ts#L376)

Builds the `sub` claim from the session record. Defaults to the bound `subjectId`, otherwise the account: without
its chain for a wallet that signed with its own key, with its chain for a smart contract wallet (see
`siwxJwtSubject`).

#### Parameters

##### record

[`SiwxSessionRecord`](/packages/siwx-server/server/interfaces/SiwxSessionRecord.md)

#### Returns

`string` \| `Promise`\<`string`\>

***

### ttlSeconds?

> `optional` **ttlSeconds?**: `number`

Defined in: [siwx-server/src/types.ts:370](https://github.com/TuwaIO/siwx/blob/main/packages/siwx-server/src/types.ts#L370)

Token lifetime in seconds, from 1 to 604800 (7 days). A token never outlives its session.

#### Default

```ts
600
```
