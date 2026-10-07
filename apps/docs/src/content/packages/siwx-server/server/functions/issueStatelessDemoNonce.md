# issueStatelessDemoNonce()

> **issueStatelessDemoNonce**(`secret`, `ttlSeconds?`): `Promise`\<`string`\>

Defined in: [siwx-server/src/server.ts:278](https://github.com/TuwaIO/siwx/blob/main/packages/siwx-server/src/server.ts#L278)

Issues a challenge nonce for the stateless demo profile: a random value and an expiry time, signed with
HMAC-SHA256 (Web Crypto), encoded as 106 lowercase hex characters so that it is a valid CAIP-122 nonce.
[verifyStatelessDemoNonce](/packages/siwx-server/server/functions/verifyStatelessDemoNonce.md) can then check, without any storage, that the server issued the nonce and that it
has not expired.

## Parameters

### secret

`string`

Server-only signing secret of at least 32 characters.

### ttlSeconds?

`number` = `300`

How long the nonce can be used, in seconds.

## Returns

`Promise`\<`string`\>

The signed nonce.

## Throws

If `secret` is shorter than 32 characters.
