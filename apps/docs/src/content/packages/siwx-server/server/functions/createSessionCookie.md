# createSessionCookie()

> **createSessionCookie**(`value`, `opts?`): `string`

Defined in: [siwx-server/src/server.ts:372](https://github.com/TuwaIO/siwx/blob/main/packages/siwx-server/src/server.ts#L372)

Formats a `Set-Cookie` header value for the session cookie: `HttpOnly`, `Secure` and `SameSite=Strict` by
default.

## Parameters

### value

`string`

The cookie value (session ID or demo token). Written as-is, without encoding.

### opts?

[`CookieOptions`](/packages/siwx-server/server/interfaces/CookieOptions.md) = `{}`

Cookie attributes. Defaults: name `siwx-session-v2`, `Max-Age` 604800, path `/`.

## Returns

`string`

The header value, e.g. `siwx-session-v2=…; Max-Age=604800; Path=/; HttpOnly; SameSite=Strict; Secure`.
