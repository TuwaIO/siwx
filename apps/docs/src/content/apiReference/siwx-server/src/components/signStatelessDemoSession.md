[**API Reference — @tuwaio/siwx (CAIP-122 Authentication Layer)**](../../../README.md)

***

# signStatelessDemoSession()

> **signStatelessDemoSession**(`session`, `secret`, `ttlSeconds?`): `Promise`\<`string`\>

Defined in: [packages/siwx-server/src/server.ts:162](https://github.com/TuwaIO/siwx/blob/bbc740ccb7f405b75bd0d4e5a1bc973b1e131514/packages/siwx-server/src/server.ts#L162)

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
