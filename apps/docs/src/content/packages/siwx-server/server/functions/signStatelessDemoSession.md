# signStatelessDemoSession()

> **signStatelessDemoSession**(`session`, `secret`, `ttlSeconds?`): `Promise`\<`string`\>

Defined in: [siwx-server/src/server.ts:164](https://github.com/TuwaIO/siwx/blob/main/packages/siwx-server/src/server.ts#L164)

Creates a stateless demo session token: the session as base64url JSON ([StatelessDemoTokenPayload](/packages/siwx-server/server/interfaces/StatelessDemoTokenPayload.md)) plus
an HMAC-SHA256 signature (Web Crypto). The token is signed, not encrypted, and cannot be revoked before it
expires.

## Parameters

### session

[`SiwxSession`](/packages/siwx-server/server/interfaces/SiwxSession.md)

The verified session to sign.

### secret

`string`

Server-only signing secret of at least 32 characters.

### ttlSeconds?

`number` = `1800`

Token lifetime in seconds, used only when the session has no `expirationTime`; otherwise the
token expires with the message.

## Returns

`Promise`\<`string`\>

The token, formatted as `{payload}.{signature}`.

## Throws

If `secret` is shorter than 32 characters.
