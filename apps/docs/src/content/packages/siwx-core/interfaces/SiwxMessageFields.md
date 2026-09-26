# SiwxMessageFields

Defined in: [types.ts:33](https://github.com/TuwaIO/siwx/blob/main/packages/siwx-core/src/types.ts#L33)

Fields of a CAIP-122 sign-in message. They are the input of `buildMessage` and the output of
`parseMessage`; `validateMessage` checks their format.

## Properties

### address

> **address**: `string`

Defined in: [types.ts:44](https://github.com/TuwaIO/siwx/blob/main/packages/siwx-core/src/types.ts#L44)

CAIP-10 account ID of the signer: `{namespace}:{chainReference}:{address}`.

#### Example

```ts
"eip155:1:0xAb5801a7D398351b8bE11C439e05C5B3259aeC9B"
```

***

### chainId

> **chainId**: `` `solana:${string}` `` \| `` `eip155:${string}` ``

Defined in: [types.ts:68](https://github.com/TuwaIO/siwx/blob/main/packages/siwx-core/src/types.ts#L68)

CAIP-2 chain ID the session is bound to.

#### Example

```ts
"eip155:1"
```

***

### domain

> **domain**: `string`

Defined in: [types.ts:38](https://github.com/TuwaIO/siwx/blob/main/packages/siwx-core/src/types.ts#L38)

RFC 3986 authority (host and optional port) requesting the sign-in, without a scheme.

#### Example

```ts
"app.tuwa.io"
```

***

### expirationTime?

> `optional` **expirationTime?**: `string`

Defined in: [types.ts:86](https://github.com/TuwaIO/siwx/blob/main/packages/siwx-core/src/types.ts#L86)

Optional ISO 8601 date-time after which the signed message is no longer valid.

***

### issuedAt

> **issuedAt**: `string`

Defined in: [types.ts:81](https://github.com/TuwaIO/siwx/blob/main/packages/siwx-core/src/types.ts#L81)

ISO 8601 date-time when the message was created.

#### Example

```ts
"2026-08-06T08:00:00.000Z"
```

***

### nonce

> **nonce**: `string`

Defined in: [types.ts:75](https://github.com/TuwaIO/siwx/blob/main/packages/siwx-core/src/types.ts#L75)

Random value that binds the signature to one sign-in attempt and prevents replay. `validateMessage`
requires at least 8 alphanumeric characters; `generateNonce` returns 32 hex characters.

#### Example

```ts
"a4f3b2c1d0e5f6789abc0123456789ab"
```

***

### notBefore?

> `optional` **notBefore?**: `string`

Defined in: [types.ts:92](https://github.com/TuwaIO/siwx/blob/main/packages/siwx-core/src/types.ts#L92)

Optional ISO 8601 date-time before which the signed message is not yet valid. `validateMessage` rejects the
message until then.

***

### requestId?

> `optional` **requestId?**: `string`

Defined in: [types.ts:97](https://github.com/TuwaIO/siwx/blob/main/packages/siwx-core/src/types.ts#L97)

Optional system-specific identifier of the request.

***

### resources?

> `optional` **resources?**: `string`[]

Defined in: [types.ts:102](https://github.com/TuwaIO/siwx/blob/main/packages/siwx-core/src/types.ts#L102)

Optional list of URIs the user wishes to have resolved as part of the sign-in.

***

### statement?

> `optional` **statement?**: `string`

Defined in: [types.ts:50](https://github.com/TuwaIO/siwx/blob/main/packages/siwx-core/src/types.ts#L50)

Optional human-readable statement shown to the user. Must be a single line: `validateMessage`
rejects statements that contain `\n`.

***

### uri

> **uri**: `string`

Defined in: [types.ts:57](https://github.com/TuwaIO/siwx/blob/main/packages/siwx-core/src/types.ts#L57)

RFC 3986 URI of the resource that is the subject of the sign-in. `validateMessage` requires an
`http://` or `https://` URI.

#### Example

```ts
"https://app.tuwa.io"
```

***

### version

> **version**: `"1"`

Defined in: [types.ts:62](https://github.com/TuwaIO/siwx/blob/main/packages/siwx-core/src/types.ts#L62)

Version of the CAIP-122 message format. Always `"1"`.
