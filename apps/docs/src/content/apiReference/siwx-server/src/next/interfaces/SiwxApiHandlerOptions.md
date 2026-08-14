[**API Reference — @tuwaio/siwx (CAIP-122 Authentication Layer)**](../../../../README.md)

***

# SiwxApiHandlerOptions

Defined in: [packages/siwx-server/src/next.ts:26](https://github.com/TuwaIO/siwx/blob/5afdbf8444bc2b94d7f938774996543e40e8ee51/packages/siwx-server/src/next.ts#L26)

## Properties

### cookieOptions?

> `optional` **cookieOptions?**: [`CookieOptions`](../../interfaces/CookieOptions.md)

Defined in: [packages/siwx-server/src/next.ts:45](https://github.com/TuwaIO/siwx/blob/5afdbf8444bc2b94d7f938774996543e40e8ee51/packages/siwx-server/src/next.ts#L45)

Cookie configuration options (name, secure, path, domain, maxAge).

***

### nonceStore

> **nonceStore**: [`SiwxNonceStore`](../../interfaces/SiwxNonceStore.md)

Defined in: [packages/siwx-server/src/next.ts:35](https://github.com/TuwaIO/siwx/blob/5afdbf8444bc2b94d7f938774996543e40e8ee51/packages/siwx-server/src/next.ts#L35)

Durable single-use nonce store instance (e.g. RedisSiwxNonceStore or MemorySiwxNonceStore for tests).

***

### policy?

> `optional` **policy?**: [`SiwxVerificationPolicy`](../../interfaces/SiwxVerificationPolicy.md)

Defined in: [packages/siwx-server/src/next.ts:40](https://github.com/TuwaIO/siwx/blob/5afdbf8444bc2b94d7f938774996543e40e8ee51/packages/siwx-server/src/next.ts#L40)

Verification policy to enforce (expected domains, URIs, allowed chains, expiration limits).

***

### sessionStore

> **sessionStore**: [`SiwxSessionStore`](../../interfaces/SiwxSessionStore.md)

Defined in: [packages/siwx-server/src/next.ts:30](https://github.com/TuwaIO/siwx/blob/5afdbf8444bc2b94d7f938774996543e40e8ee51/packages/siwx-server/src/next.ts#L30)

Durable session store instance (e.g. RedisSiwxSessionStore or MemorySiwxSessionStore for tests).

***

### ttlSeconds?

> `optional` **ttlSeconds?**: `number`

Defined in: [packages/siwx-server/src/next.ts:55](https://github.com/TuwaIO/siwx/blob/5afdbf8444bc2b94d7f938774996543e40e8ee51/packages/siwx-server/src/next.ts#L55)

Session time-to-live in seconds (defaults to 7 days = 604800s).

***

### verifyOptions?

> `optional` **verifyOptions?**: `Omit`\<[`ServerVerifyOptions`](../../interfaces/ServerVerifyOptions.md), `"policy"` \| `"usedNonces"`\>

Defined in: [packages/siwx-server/src/next.ts:50](https://github.com/TuwaIO/siwx/blob/5afdbf8444bc2b94d7f938774996543e40e8ee51/packages/siwx-server/src/next.ts#L50)

Additional verification options (e.g. custom public client).
