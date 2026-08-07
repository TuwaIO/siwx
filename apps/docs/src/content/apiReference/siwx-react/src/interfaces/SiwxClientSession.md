[**API Reference — @tuwaio/siwx (CAIP-122 Authentication Layer)**](../../../README.md)

***

# SiwxClientSession

Defined in: [packages/siwx-react/src/sessionStore.ts:15](https://github.com/TuwaIO/siwx/blob/21578d633a347019ae3f513dd601d57e4fa60138/packages/siwx-react/src/sessionStore.ts#L15)

The shape of a client-side SIWX session.

## Properties

### address

> **address**: `string`

Defined in: [packages/siwx-react/src/sessionStore.ts:17](https://github.com/TuwaIO/siwx/blob/21578d633a347019ae3f513dd601d57e4fa60138/packages/siwx-react/src/sessionStore.ts#L17)

The verified CAIP-10 blockchain address.

***

### chainId

> **chainId**: `string`

Defined in: [packages/siwx-react/src/sessionStore.ts:19](https://github.com/TuwaIO/siwx/blob/21578d633a347019ae3f513dd601d57e4fa60138/packages/siwx-react/src/sessionStore.ts#L19)

The CAIP-2 chain ID the session is bound to.

***

### domain

> **domain**: `string`

Defined in: [packages/siwx-react/src/sessionStore.ts:25](https://github.com/TuwaIO/siwx/blob/21578d633a347019ae3f513dd601d57e4fa60138/packages/siwx-react/src/sessionStore.ts#L25)

The domain the session was issued for.

***

### expirationTime?

> `optional` **expirationTime?**: `string`

Defined in: [packages/siwx-react/src/sessionStore.ts:23](https://github.com/TuwaIO/siwx/blob/21578d633a347019ae3f513dd601d57e4fa60138/packages/siwx-react/src/sessionStore.ts#L23)

ISO 8601 datetime when the session expires, if set.

***

### issuedAt

> **issuedAt**: `string`

Defined in: [packages/siwx-react/src/sessionStore.ts:21](https://github.com/TuwaIO/siwx/blob/21578d633a347019ae3f513dd601d57e4fa60138/packages/siwx-react/src/sessionStore.ts#L21)

ISO 8601 datetime when the session was issued.
