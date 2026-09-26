# SiwxApiHandlerOptions

Defined in: [siwx-server/src/next.ts:35](https://github.com/TuwaIO/siwx/blob/main/packages/siwx-server/src/next.ts#L35)

## Properties

### cookieOptions?

> `optional` **cookieOptions?**: [`CookieOptions`](/packages/siwx-server/server/interfaces/CookieOptions.md)

Defined in: [siwx-server/src/next.ts:57](https://github.com/TuwaIO/siwx/blob/main/packages/siwx-server/src/next.ts#L57)

Attributes of the session cookie. `maxAge` is replaced by the session TTL.

***

### nonceStore

> **nonceStore**: [`SiwxNonceStore`](/packages/siwx-server/server/interfaces/SiwxNonceStore.md)

Defined in: [siwx-server/src/next.ts:46](https://github.com/TuwaIO/siwx/blob/main/packages/siwx-server/src/next.ts#L46)

Durable single-use nonce store shared by every server instance (your Redis or database implementation;
`MemorySiwxNonceStore` in development and tests).

***

### policy?

> `optional` **policy?**: [`SiwxVerificationPolicy`](/packages/siwx-server/server/interfaces/SiwxVerificationPolicy.md)

Defined in: [siwx-server/src/next.ts:52](https://github.com/TuwaIO/siwx/blob/main/packages/siwx-server/src/next.ts#L52)

Policy enforced by `POST /verify` (domain, URI, chains, timing). Set at least `expectedDomain`: without a policy
the message domain is not checked.

***

### sessionStore

> **sessionStore**: [`SiwxSessionStore`](/packages/siwx-server/server/interfaces/SiwxSessionStore.md)

Defined in: [siwx-server/src/next.ts:40](https://github.com/TuwaIO/siwx/blob/main/packages/siwx-server/src/next.ts#L40)

Durable session store shared by every server instance (your Redis or database implementation;
`MemorySiwxSessionStore` in development and tests).

***

### ttlSeconds?

> `optional` **ttlSeconds?**: `number`

Defined in: [siwx-server/src/next.ts:68](https://github.com/TuwaIO/siwx/blob/main/packages/siwx-server/src/next.ts#L68)

Session lifetime in seconds, used for the store record and the cookie `Max-Age`. Defaults to
`cookieOptions.maxAge`, then to 604800 (7 days).

***

### verifyOptions?

> `optional` **verifyOptions?**: `Omit`\<[`ServerVerifyOptions`](/packages/siwx-server/server/interfaces/ServerVerifyOptions.md), `"policy"` \| `"usedNonces"`\>

Defined in: [siwx-server/src/next.ts:62](https://github.com/TuwaIO/siwx/blob/main/packages/siwx-server/src/next.ts#L62)

Extra options of `verifySiwxPayload`, for example `publicClient` for EIP-1271 wallets.
