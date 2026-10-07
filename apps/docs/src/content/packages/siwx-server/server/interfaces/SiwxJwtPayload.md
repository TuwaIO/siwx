# SiwxJwtPayload

Defined in: [siwx-server/src/types.ts:362](https://github.com/TuwaIO/siwx/blob/main/packages/siwx-server/src/types.ts#L362)

Claims of a JWT issued for a SIWX session. Times are Unix seconds.

## Indexable

> \[`claim`: `string`\]: `unknown`

Custom claims added when the token was signed.

## Properties

### aud?

> `optional` **aud?**: `string` \| `string`[]

Defined in: [siwx-server/src/types.ts:371](https://github.com/TuwaIO/siwx/blob/main/packages/siwx-server/src/types.ts#L371)

Audience, when one was set.

***

### caip10

> **caip10**: `string`

Defined in: [siwx-server/src/types.ts:379](https://github.com/TuwaIO/siwx/blob/main/packages/siwx-server/src/types.ts#L379)

The signed-in CAIP-10 account as it was signed, with Solana chain IDs in their genesis-hash form.

***

### chain\_id

> **chain\_id**: `string`

Defined in: [siwx-server/src/types.ts:381](https://github.com/TuwaIO/siwx/blob/main/packages/siwx-server/src/types.ts#L381)

The CAIP-2 chain ID of the sign-in, with Solana chain IDs in their genesis-hash form.

***

### exp

> **exp**: `number`

Defined in: [siwx-server/src/types.ts:375](https://github.com/TuwaIO/siwx/blob/main/packages/siwx-server/src/types.ts#L375)

Expiration time.

***

### iat

> **iat**: `number`

Defined in: [siwx-server/src/types.ts:373](https://github.com/TuwaIO/siwx/blob/main/packages/siwx-server/src/types.ts#L373)

Issued at.

***

### iss

> **iss**: `string`

Defined in: [siwx-server/src/types.ts:364](https://github.com/TuwaIO/siwx/blob/main/packages/siwx-server/src/types.ts#L364)

Issuer: the URL of your app.

***

### jti

> **jti**: `string`

Defined in: [siwx-server/src/types.ts:377](https://github.com/TuwaIO/siwx/blob/main/packages/siwx-server/src/types.ts#L377)

Unique token ID: 16 random bytes, base64url.

***

### sub

> **sub**: `string`

Defined in: [siwx-server/src/types.ts:369](https://github.com/TuwaIO/siwx/blob/main/packages/siwx-server/src/types.ts#L369)

Subject: a stable ID of the user. By default the user ID bound with `bindSubject`, otherwise the account without
its chain (`eip155:0x…` in lowercase, `solana:<address>`).
