[**API Reference — @tuwaio/siwx (CAIP-122 Authentication Layer)**](../../../README.md)

***

# SiwxClientSession

Defined in: [packages/siwx-react/src/sessionStore.ts:14](https://github.com/TuwaIO/siwx/blob/226309e8a8af6d2fb968b23cea6b3dc7f2a3300b/packages/siwx-react/src/sessionStore.ts#L14)

The shape of a client-side SIWX session.

## Properties

### address

> **address**: `string`

Defined in: [packages/siwx-react/src/sessionStore.ts:16](https://github.com/TuwaIO/siwx/blob/226309e8a8af6d2fb968b23cea6b3dc7f2a3300b/packages/siwx-react/src/sessionStore.ts#L16)

The verified CAIP-10 blockchain address.

***

### chainId

> **chainId**: `string`

Defined in: [packages/siwx-react/src/sessionStore.ts:18](https://github.com/TuwaIO/siwx/blob/226309e8a8af6d2fb968b23cea6b3dc7f2a3300b/packages/siwx-react/src/sessionStore.ts#L18)

The CAIP-2 chain ID the session is bound to.

***

### domain

> **domain**: `string`

Defined in: [packages/siwx-react/src/sessionStore.ts:24](https://github.com/TuwaIO/siwx/blob/226309e8a8af6d2fb968b23cea6b3dc7f2a3300b/packages/siwx-react/src/sessionStore.ts#L24)

The domain the session was issued for.

***

### expirationTime?

> `optional` **expirationTime?**: `string`

Defined in: [packages/siwx-react/src/sessionStore.ts:22](https://github.com/TuwaIO/siwx/blob/226309e8a8af6d2fb968b23cea6b3dc7f2a3300b/packages/siwx-react/src/sessionStore.ts#L22)

ISO 8601 datetime when the session expires, if set.

***

### issuedAt

> **issuedAt**: `string`

Defined in: [packages/siwx-react/src/sessionStore.ts:20](https://github.com/TuwaIO/siwx/blob/226309e8a8af6d2fb968b23cea6b3dc7f2a3300b/packages/siwx-react/src/sessionStore.ts#L20)

ISO 8601 datetime when the session was issued.
