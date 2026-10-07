# SiwxApiHandlerOptions

Defined in: [siwx-server/src/next.ts:38](https://github.com/TuwaIO/siwx/blob/main/packages/siwx-server/src/next.ts#L38)

## Properties

### cookieOptions?

> `optional` **cookieOptions?**: [`CookieOptions`](/packages/siwx-server/server/interfaces/CookieOptions.md)

Defined in: [siwx-server/src/next.ts:60](https://github.com/TuwaIO/siwx/blob/main/packages/siwx-server/src/next.ts#L60)

Attributes of the session cookie. `maxAge` is replaced by the session TTL.

***

### jwt?

> `optional` **jwt?**: [`SiwxJwtOptions`](/packages/siwx-server/server/interfaces/SiwxJwtOptions.md)

Defined in: [siwx-server/src/next.ts:78](https://github.com/TuwaIO/siwx/blob/main/packages/siwx-server/src/next.ts#L78)

Enables `GET …/token` and `GET …/jwks`: a short-lived JWT for the signed-in wallet and the public keys that verify
it, for services that accept a sign-in only as a JWT (embedded wallet providers with custom authentication such as
Coinbase CDP, identity platforms, your own services). Without it both paths return 404.

***

### nonceStore

> **nonceStore**: [`SiwxNonceStore`](/packages/siwx-server/server/interfaces/SiwxNonceStore.md)

Defined in: [siwx-server/src/next.ts:49](https://github.com/TuwaIO/siwx/blob/main/packages/siwx-server/src/next.ts#L49)

Durable single-use nonce store shared by every server instance (your Redis or database implementation;
`MemorySiwxNonceStore` in development and tests).

***

### policy?

> `optional` **policy?**: [`SiwxVerificationPolicy`](/packages/siwx-server/server/interfaces/SiwxVerificationPolicy.md)

Defined in: [siwx-server/src/next.ts:55](https://github.com/TuwaIO/siwx/blob/main/packages/siwx-server/src/next.ts#L55)

Policy enforced by `POST /verify` (domain, URI, chains, timing). Set at least `expectedDomain`: without a policy
the message domain is not checked.

***

### sessionStore

> **sessionStore**: [`SiwxSessionStore`](/packages/siwx-server/server/interfaces/SiwxSessionStore.md)

Defined in: [siwx-server/src/next.ts:43](https://github.com/TuwaIO/siwx/blob/main/packages/siwx-server/src/next.ts#L43)

Durable session store shared by every server instance (your Redis or database implementation;
`MemorySiwxSessionStore` in development and tests).

***

### ttlSeconds?

> `optional` **ttlSeconds?**: `number`

Defined in: [siwx-server/src/next.ts:72](https://github.com/TuwaIO/siwx/blob/main/packages/siwx-server/src/next.ts#L72)

Session lifetime in seconds, used for the store record and the cookie `Max-Age`. Defaults to
`cookieOptions.maxAge`, then to 604800 (7 days).

***

### verifyOptions?

> `optional` **verifyOptions?**: `Omit`\<[`ServerVerifyOptions`](/packages/siwx-server/server/interfaces/ServerVerifyOptions.md), `"policy"` \| `"usedNonces"`\>

Defined in: [siwx-server/src/next.ts:66](https://github.com/TuwaIO/siwx/blob/main/packages/siwx-server/src/next.ts#L66)

Extra options of `verifySiwxPayload`, for example `publicClient` (a client, or a function of the chain number) for
smart contract wallets.
