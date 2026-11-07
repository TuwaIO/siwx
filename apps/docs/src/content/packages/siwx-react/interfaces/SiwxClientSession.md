# SiwxClientSession

Defined in: [siwx-react/src/sessionStore.ts:23](https://github.com/TuwaIO/siwx/blob/main/packages/siwx-react/src/sessionStore.ts#L23)

Client-side view of a verified SIWX session. The JSON returned by the `verify` and `session` endpoints of
`@tuwaio/siwx-server/next` has these fields. It is display state only, never proof of identity.

## Properties

### address

> **address**: `string`

Defined in: [siwx-react/src/sessionStore.ts:25](https://github.com/TuwaIO/siwx/blob/main/packages/siwx-react/src/sessionStore.ts#L25)

The verified CAIP-10 blockchain address.

***

### chainId

> **chainId**: `string`

Defined in: [siwx-react/src/sessionStore.ts:27](https://github.com/TuwaIO/siwx/blob/main/packages/siwx-react/src/sessionStore.ts#L27)

The CAIP-2 chain ID the session is bound to.

***

### domain

> **domain**: `string`

Defined in: [siwx-react/src/sessionStore.ts:33](https://github.com/TuwaIO/siwx/blob/main/packages/siwx-react/src/sessionStore.ts#L33)

The domain the session was issued for.

***

### expirationTime?

> `optional` **expirationTime?**: `string`

Defined in: [siwx-react/src/sessionStore.ts:31](https://github.com/TuwaIO/siwx/blob/main/packages/siwx-react/src/sessionStore.ts#L31)

ISO 8601 datetime when the session expires, if set.

***

### issuedAt

> **issuedAt**: `string`

Defined in: [siwx-react/src/sessionStore.ts:29](https://github.com/TuwaIO/siwx/blob/main/packages/siwx-react/src/sessionStore.ts#L29)

ISO 8601 datetime when the session was issued.
