# verifyStatelessDemoNonce()

> **verifyStatelessDemoNonce**(`nonce`, `secret`): `Promise`\<`boolean`\>

Defined in: [siwx-server/src/server.ts:340](https://github.com/TuwaIO/siwx/blob/main/packages/siwx-server/src/server.ts#L340)

Checks a nonce issued by [issueStatelessDemoNonce](/packages/siwx-server/server/functions/issueStatelessDemoNonce.md): its format, its HMAC signature (constant-time, Web
Crypto) and its expiry. It does not track usage, so the same nonce passes until it expires; callers that need
single use must remember consumed nonces (`createStatelessDemoSiwxHandler` does so per server instance).

## Parameters

### nonce

`string`

The nonce of the signed message.

### secret

`string`

The secret the nonce was issued with.

## Returns

`Promise`\<`boolean`\>

`true` if the nonce was issued with `secret` and has not expired; otherwise `false`. Never throws.
