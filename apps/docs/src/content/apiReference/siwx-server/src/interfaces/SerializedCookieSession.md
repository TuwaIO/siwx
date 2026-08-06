[**API Reference — @tuwaio/siwx (CAIP-122 Authentication Layer)**](../../../README.md)

***

# SerializedCookieSession

Defined in: [packages/siwx-server/src/types.ts:95](https://github.com/TuwaIO/siwx/blob/83e0c9855663c2d6978ceb9e5f570cbbfb6bb802/packages/siwx-server/src/types.ts#L95)

The serialized cookie string and session data together.

## Properties

### cookieHeader

> **cookieHeader**: `string`

Defined in: [packages/siwx-server/src/types.ts:97](https://github.com/TuwaIO/siwx/blob/83e0c9855663c2d6978ceb9e5f570cbbfb6bb802/packages/siwx-server/src/types.ts#L97)

The full `Set-Cookie` header value.

***

### cookieValue

> **cookieValue**: `string`

Defined in: [packages/siwx-server/src/types.ts:101](https://github.com/TuwaIO/siwx/blob/83e0c9855663c2d6978ceb9e5f570cbbfb6bb802/packages/siwx-server/src/types.ts#L101)

The base64url-encoded session payload (the cookie value).

***

### session

> **session**: [`SiwxSession`](SiwxSession.md)

Defined in: [packages/siwx-server/src/types.ts:99](https://github.com/TuwaIO/siwx/blob/83e0c9855663c2d6978ceb9e5f570cbbfb6bb802/packages/siwx-server/src/types.ts#L99)

The session data embedded in the cookie.
