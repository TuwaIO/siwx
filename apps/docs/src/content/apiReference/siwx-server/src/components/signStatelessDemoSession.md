[**API Reference — @tuwaio/siwx (CAIP-122 Authentication Layer)**](../../../README.md)

***

# signStatelessDemoSession()

> **signStatelessDemoSession**(`session`, `secret`, `ttlSeconds?`): `Promise`\<`string`\>

Defined in: [packages/siwx-server/src/server.ts:163](https://github.com/TuwaIO/siwx/blob/fcaa3a6f9f1375901c6bae0f335f995349246d8e/packages/siwx-server/src/server.ts#L163)

Signs a stateless demo session into an authenticated compact token.
Uses Web Crypto HMAC-SHA256.

## Parameters

### session

[`SiwxSession`](../interfaces/SiwxSession.md)

The verified session to sign.

### secret

`string`

Server-only signing secret (minimum 32 bytes).

### ttlSeconds?

`number` = `1800`

Maximum session validity in seconds (default 1800 = 30m).

## Returns

`Promise`\<`string`\>

Authenticated compact token in `${payload}.${signature}` format.
