[**API Reference — @tuwaio/siwx (CAIP-122 Authentication Layer)**](../../../README.md)

***

# SiwxMessageFields

Defined in: [packages/siwx-core/src/types.ts:30](https://github.com/TuwaIO/siwx/blob/fcaa3a6f9f1375901c6bae0f335f995349246d8e/packages/siwx-core/src/types.ts#L30)

The complete set of fields required to build a CAIP-122 compliant message.
All fields follow the CAIP-122 specification.

## Properties

### address

> **address**: `string`

Defined in: [packages/siwx-core/src/types.ts:41](https://github.com/TuwaIO/siwx/blob/fcaa3a6f9f1375901c6bae0f335f995349246d8e/packages/siwx-core/src/types.ts#L41)

The blockchain account address performing the sign-in, CAIP-10 compliant.

#### Example

```ts
"eip155:1:0xAb5801a7D398351b8bE11C439e05C5B3259aeC9B"
```

***

### chainId

> **chainId**: `` `eip155:${string}` `` \| `` `solana:${string}` ``

Defined in: [packages/siwx-core/src/types.ts:65](https://github.com/TuwaIO/siwx/blob/fcaa3a6f9f1375901c6bae0f335f995349246d8e/packages/siwx-core/src/types.ts#L65)

The CAIP-2 chain ID to which the session is bound.

#### Example

```ts
"eip155:1"
```

***

### domain

> **domain**: `string`

Defined in: [packages/siwx-core/src/types.ts:35](https://github.com/TuwaIO/siwx/blob/fcaa3a6f9f1375901c6bae0f335f995349246d8e/packages/siwx-core/src/types.ts#L35)

The RFC 3986 URI of the domain requesting the sign-in.

#### Example

```ts
"app.tuwa.io"
```

***

### expirationTime?

> `optional` **expirationTime?**: `string`

Defined in: [packages/siwx-core/src/types.ts:82](https://github.com/TuwaIO/siwx/blob/fcaa3a6f9f1375901c6bae0f335f995349246d8e/packages/siwx-core/src/types.ts#L82)

Optional ISO 8601 datetime string after which the session is no longer valid.

***

### issuedAt

> **issuedAt**: `string`

Defined in: [packages/siwx-core/src/types.ts:77](https://github.com/TuwaIO/siwx/blob/fcaa3a6f9f1375901c6bae0f335f995349246d8e/packages/siwx-core/src/types.ts#L77)

The ISO 8601 datetime string of when the message was generated.

#### Example

```ts
"2021-09-30T16:25:24Z"
```

***

### nonce

> **nonce**: `string`

Defined in: [packages/siwx-core/src/types.ts:71](https://github.com/TuwaIO/siwx/blob/fcaa3a6f9f1375901c6bae0f335f995349246d8e/packages/siwx-core/src/types.ts#L71)

A unique, secure, randomly generated string used to prevent replay attacks.

#### Example

```ts
"32891757"
```

***

### notBefore?

> `optional` **notBefore?**: `string`

Defined in: [packages/siwx-core/src/types.ts:87](https://github.com/TuwaIO/siwx/blob/fcaa3a6f9f1375901c6bae0f335f995349246d8e/packages/siwx-core/src/types.ts#L87)

Optional ISO 8601 datetime string when the session is valid from.

***

### requestId?

> `optional` **requestId?**: `string`

Defined in: [packages/siwx-core/src/types.ts:92](https://github.com/TuwaIO/siwx/blob/fcaa3a6f9f1375901c6bae0f335f995349246d8e/packages/siwx-core/src/types.ts#L92)

Optional system-specific identifier for the request.

***

### resources?

> `optional` **resources?**: `string`[]

Defined in: [packages/siwx-core/src/types.ts:97](https://github.com/TuwaIO/siwx/blob/fcaa3a6f9f1375901c6bae0f335f995349246d8e/packages/siwx-core/src/types.ts#L97)

Optional list of URIs the session is valid for.

***

### statement?

> `optional` **statement?**: `string`

Defined in: [packages/siwx-core/src/types.ts:47](https://github.com/TuwaIO/siwx/blob/fcaa3a6f9f1375901c6bae0f335f995349246d8e/packages/siwx-core/src/types.ts#L47)

A statement (human-readable) that the user will sign.
Must not contain '\n'.

***

### uri

> **uri**: `string`

Defined in: [packages/siwx-core/src/types.ts:53](https://github.com/TuwaIO/siwx/blob/fcaa3a6f9f1375901c6bae0f335f995349246d8e/packages/siwx-core/src/types.ts#L53)

The RFC 3986 URI referring to the resource that is the subject of the sign-in.

#### Example

```ts
"https://app.tuwa.io"
```

***

### version

> **version**: `"1"`

Defined in: [packages/siwx-core/src/types.ts:59](https://github.com/TuwaIO/siwx/blob/fcaa3a6f9f1375901c6bae0f335f995349246d8e/packages/siwx-core/src/types.ts#L59)

The version of the CAIP-122 message specification.
Currently always "1".
