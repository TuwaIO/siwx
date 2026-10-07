# parseCookie()

> **parseCookie**(`cookieHeader`, `name`): `string` \| `null`

Defined in: [siwx-server/src/server.ts:380](https://github.com/TuwaIO/siwx/blob/main/packages/siwx-server/src/server.ts#L380)

Reads one cookie from a `Cookie` request header. Pairs must be separated by `"; "`; values are returned as-is,
without URL-decoding.

## Parameters

### cookieHeader

`string` \| `null` \| `undefined`

The `Cookie` header value.

### name

`string`

The cookie name.

## Returns

`string` \| `null`

The cookie value, or `null` when the header is empty or has no such cookie.
