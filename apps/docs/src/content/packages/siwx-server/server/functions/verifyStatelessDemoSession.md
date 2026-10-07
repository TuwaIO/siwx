# verifyStatelessDemoSession()

> **verifyStatelessDemoSession**(`token`, `secret`, `policy?`): `Promise`\<[`SiwxSession`](/packages/siwx-server/server/interfaces/SiwxSession.md) \| `null`\>

Defined in: [siwx-server/src/server.ts:172](https://github.com/TuwaIO/siwx/blob/main/packages/siwx-server/src/server.ts#L172)

Verifies a token created by [signStatelessDemoSession](/packages/siwx-server/server/functions/signStatelessDemoSession.md): checks the HMAC signature with Web Crypto, the
token version and mode, and its expiry (with `policy.clockSkewSeconds`, 60 seconds by default).

Only `expectedDomain` and `allowedChainIds` (exact match, except that a Solana cluster matches under its name and its
genesis-hash chain ID) of the policy are applied; other policy fields are ignored because they were checked when the
token was issued.

## Parameters

### token

`string` \| `null` \| `undefined`

The token from the session cookie.

### secret

`string`

The secret the token was signed with.

### policy?

[`SiwxVerificationPolicy`](/packages/siwx-server/server/interfaces/SiwxVerificationPolicy.md)

Optional policy to check against the token.

## Returns

`Promise`\<[`SiwxSession`](/packages/siwx-server/server/interfaces/SiwxSession.md) \| `null`\>

The session, or `null` if the token is missing, malformed, tampered, expired or rejected by the policy.
Never throws.
