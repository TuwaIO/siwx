[**API Reference — @tuwaio/siwx (CAIP-122 Authentication Layer)**](../../../README.md)

***

# verifyStatelessDemoSession()

> **verifyStatelessDemoSession**(`token`, `secret`, `policy?`): `Promise`\<[`SiwxSession`](../interfaces/SiwxSession.md) \| `null`\>

Defined in: [packages/siwx-server/src/server.ts:205](https://github.com/TuwaIO/siwx/blob/fcaa3a6f9f1375901c6bae0f335f995349246d8e/packages/siwx-server/src/server.ts#L205)

Verifies an authenticated stateless demo session token.
Performs constant-time cryptographic verification and validates expiration and policy.

## Parameters

### token

`string` \| `null` \| `undefined`

Compact token from cookie (`${payload}.${signature}`).

### secret

`string`

Server-only signing secret.

### policy?

[`SiwxVerificationPolicy`](../interfaces/SiwxVerificationPolicy.md)

Optional verification policy to enforce.

## Returns

`Promise`\<[`SiwxSession`](../interfaces/SiwxSession.md) \| `null`\>

The verified SiwxSession, or null if invalid, expired, or tampered.
