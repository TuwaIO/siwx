[**API Reference — @tuwaio/siwx (CAIP-122 Authentication Layer)**](../../../README.md)

***

# serializeCookieSession()

> **serializeCookieSession**(`session`, `opts?`): [`SerializedCookieSession`](../interfaces/SerializedCookieSession.md)

Defined in: [packages/siwx-server/src/server.ts:142](https://github.com/TuwaIO/siwx/blob/25e4a0067650f7a94ad6029e68a5c6fc790192ab/packages/siwx-server/src/server.ts#L142)

Serializes a `SiwxSession` into an `HttpOnly` cookie string.
The session data is base64url-encoded (not encrypted — use a signed cookie or JWT for production).

This utility is intentionally simple. For production use, wrap the session
in a signed/encrypted format using a library like `iron-session` or `jose`.

## Parameters

### session

[`SiwxSession`](../interfaces/SiwxSession.md)

The verified session data to serialize.

### opts?

[`CookieOptions`](../interfaces/CookieOptions.md) = `{}`

Cookie options (name, maxAge, secure, SameSite, etc.).

## Returns

[`SerializedCookieSession`](../interfaces/SerializedCookieSession.md)

A `SerializedCookieSession` containing the `Set-Cookie` header value and session data.

## Example

```ts
const { cookieHeader } = serializeCookieSession(session);
return new Response(null, { headers: { 'Set-Cookie': cookieHeader } });
```
