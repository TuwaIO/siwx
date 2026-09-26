# SiwxClientSession

Defined in: [siwx-react/src/sessionStore.ts:16](https://github.com/TuwaIO/siwx/blob/main/packages/siwx-react/src/sessionStore.ts#L16)

Client-side view of a verified SIWX session. The JSON returned by the `verify` and `session` endpoints of
`@tuwaio/siwx-server/next` has these fields. It is display state only, never proof of identity.

## Properties

### address

> **address**: `string`

Defined in: [siwx-react/src/sessionStore.ts:18](https://github.com/TuwaIO/siwx/blob/main/packages/siwx-react/src/sessionStore.ts#L18)

The verified CAIP-10 blockchain address.

***

### chainId

> **chainId**: `string`

Defined in: [siwx-react/src/sessionStore.ts:20](https://github.com/TuwaIO/siwx/blob/main/packages/siwx-react/src/sessionStore.ts#L20)

The CAIP-2 chain ID the session is bound to.

***

### domain

> **domain**: `string`

Defined in: [siwx-react/src/sessionStore.ts:26](https://github.com/TuwaIO/siwx/blob/main/packages/siwx-react/src/sessionStore.ts#L26)

The domain the session was issued for.

***

### expirationTime?

> `optional` **expirationTime?**: `string`

Defined in: [siwx-react/src/sessionStore.ts:24](https://github.com/TuwaIO/siwx/blob/main/packages/siwx-react/src/sessionStore.ts#L24)

ISO 8601 datetime when the session expires, if set.

***

### issuedAt

> **issuedAt**: `string`

Defined in: [siwx-react/src/sessionStore.ts:22](https://github.com/TuwaIO/siwx/blob/main/packages/siwx-react/src/sessionStore.ts#L22)

ISO 8601 datetime when the session was issued.
