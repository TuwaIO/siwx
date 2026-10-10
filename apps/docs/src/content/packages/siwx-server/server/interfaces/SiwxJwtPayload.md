# SiwxJwtPayload

Defined in: [siwx-server/src/types.ts:384](https://github.com/TuwaIO/siwx/blob/main/packages/siwx-server/src/types.ts#L384)

Claims of a JWT issued for a SIWX session. Times are Unix seconds.

## Indexable

> \[`claim`: `string`\]: `unknown`

Custom claims added when the token was signed.

## Properties

### aud?

> `optional` **aud?**: `string` \| `string`[]

Defined in: [siwx-server/src/types.ts:394](https://github.com/TuwaIO/siwx/blob/main/packages/siwx-server/src/types.ts#L394)

Audience, when one was set.

***

### caip10

> **caip10**: `string`

Defined in: [siwx-server/src/types.ts:402](https://github.com/TuwaIO/siwx/blob/main/packages/siwx-server/src/types.ts#L402)

The signed-in CAIP-10 account as it was signed, with Solana chain IDs in their genesis-hash form.

***

### chain\_id

> **chain\_id**: `string`

Defined in: [siwx-server/src/types.ts:404](https://github.com/TuwaIO/siwx/blob/main/packages/siwx-server/src/types.ts#L404)

The CAIP-2 chain ID of the sign-in, with Solana chain IDs in their genesis-hash form.

***

### exp

> **exp**: `number`

Defined in: [siwx-server/src/types.ts:398](https://github.com/TuwaIO/siwx/blob/main/packages/siwx-server/src/types.ts#L398)

Expiration time.

***

### iat

> **iat**: `number`

Defined in: [siwx-server/src/types.ts:396](https://github.com/TuwaIO/siwx/blob/main/packages/siwx-server/src/types.ts#L396)

Issued at.

***

### iss

> **iss**: `string`

Defined in: [siwx-server/src/types.ts:386](https://github.com/TuwaIO/siwx/blob/main/packages/siwx-server/src/types.ts#L386)

Issuer: the URL of your app.

***

### jti

> **jti**: `string`

Defined in: [siwx-server/src/types.ts:400](https://github.com/TuwaIO/siwx/blob/main/packages/siwx-server/src/types.ts#L400)

Unique token ID: 16 random bytes, base64url.

***

### sub

> **sub**: `string`

Defined in: [siwx-server/src/types.ts:392](https://github.com/TuwaIO/siwx/blob/main/packages/siwx-server/src/types.ts#L392)

Subject: a stable ID of the user. By default the user ID bound with `bindSubject`, otherwise the account: without
its chain for a wallet that signed with its own key (`eip155:0x…` in lowercase, `solana:<address>`), with its
chain for an EVM smart contract wallet (`eip155:<chain>:0x…` in lowercase), whose owners are set on each chain.
