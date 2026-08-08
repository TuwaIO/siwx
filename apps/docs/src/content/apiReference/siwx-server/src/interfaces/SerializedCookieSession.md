[**API Reference — @tuwaio/siwx (CAIP-122 Authentication Layer)**](../../../README.md)

***

# SerializedCookieSession

Defined in: [packages/siwx-server/src/types.ts:101](https://github.com/TuwaIO/siwx/blob/9e00d3ba85452b84c97c3a62abd4327d95c89ec5/packages/siwx-server/src/types.ts#L101)

The serialized cookie string and session data together.

## Properties

### cookieHeader

> **cookieHeader**: `string`

Defined in: [packages/siwx-server/src/types.ts:103](https://github.com/TuwaIO/siwx/blob/9e00d3ba85452b84c97c3a62abd4327d95c89ec5/packages/siwx-server/src/types.ts#L103)

The full `Set-Cookie` header value.

***

### cookieValue

> **cookieValue**: `string`

Defined in: [packages/siwx-server/src/types.ts:107](https://github.com/TuwaIO/siwx/blob/9e00d3ba85452b84c97c3a62abd4327d95c89ec5/packages/siwx-server/src/types.ts#L107)

The base64url-encoded session payload (the cookie value).

***

### session

> **session**: [`SiwxSession`](SiwxSession.md)

Defined in: [packages/siwx-server/src/types.ts:105](https://github.com/TuwaIO/siwx/blob/9e00d3ba85452b84c97c3a62abd4327d95c89ec5/packages/siwx-server/src/types.ts#L105)

The session data embedded in the cookie.
