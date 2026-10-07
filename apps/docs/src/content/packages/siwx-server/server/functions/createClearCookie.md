# createClearCookie()

> **createClearCookie**(`opts?`): `string`

Defined in: [siwx-server/src/server.ts:357](https://github.com/TuwaIO/siwx/blob/main/packages/siwx-server/src/server.ts#L357)

Formats a `Set-Cookie` header value that deletes the session cookie (`Max-Age=0` and an expiry date in the
past). Use the same `name`, `path` and `domain` as when the cookie was set.

## Parameters

### opts?

[`CookieOptions`](/packages/siwx-server/server/interfaces/CookieOptions.md) = `{}`

Cookie attributes. `maxAge` is ignored.

## Returns

`string`

The header value.
