[**API Reference — @tuwaio/siwx (CAIP-122 Authentication Layer)**](../../../../README.md)

***

# StatelessDemoSiwxHandlerOptions

Defined in: [packages/siwx-server/src/next.ts:58](https://github.com/TuwaIO/siwx/blob/bbc740ccb7f405b75bd0d4e5a1bc973b1e131514/packages/siwx-server/src/next.ts#L58)

## Properties

### cookieOptions?

> `optional` **cookieOptions?**: [`CookieOptions`](../../interfaces/CookieOptions.md)

Defined in: [packages/siwx-server/src/next.ts:73](https://github.com/TuwaIO/siwx/blob/bbc740ccb7f405b75bd0d4e5a1bc973b1e131514/packages/siwx-server/src/next.ts#L73)

Cookie configuration options.

***

### demoLimits?

> `optional` **demoLimits?**: [`StatelessDemoLimits`](../../interfaces/StatelessDemoLimits.md)

Defined in: [packages/siwx-server/src/next.ts:78](https://github.com/TuwaIO/siwx/blob/bbc740ccb7f405b75bd0d4e5a1bc973b1e131514/packages/siwx-server/src/next.ts#L78)

Demo limits (payload size, max requests).

***

### policy?

> `optional` **policy?**: [`SiwxVerificationPolicy`](../../interfaces/SiwxVerificationPolicy.md)

Defined in: [packages/siwx-server/src/next.ts:68](https://github.com/TuwaIO/siwx/blob/bbc740ccb7f405b75bd0d4e5a1bc973b1e131514/packages/siwx-server/src/next.ts#L68)

Verification policy to enforce.

***

### signingSecret

> **signingSecret**: `string`

Defined in: [packages/siwx-server/src/next.ts:63](https://github.com/TuwaIO/siwx/blob/bbc740ccb7f405b75bd0d4e5a1bc973b1e131514/packages/siwx-server/src/next.ts#L63)

Server-only cryptographic secret for HMAC signing (minimum 32 characters).
MUST NEVER be exposed to the browser or client-side bundles.

***

### ttlSeconds?

> `optional` **ttlSeconds?**: `number`

Defined in: [packages/siwx-server/src/next.ts:88](https://github.com/TuwaIO/siwx/blob/bbc740ccb7f405b75bd0d4e5a1bc973b1e131514/packages/siwx-server/src/next.ts#L88)

Session TTL in seconds for demo profile (defaults to 1800s = 30 minutes).

***

### verifyOptions?

> `optional` **verifyOptions?**: `Omit`\<[`ServerVerifyOptions`](../../interfaces/ServerVerifyOptions.md), `"policy"`\>

Defined in: [packages/siwx-server/src/next.ts:83](https://github.com/TuwaIO/siwx/blob/bbc740ccb7f405b75bd0d4e5a1bc973b1e131514/packages/siwx-server/src/next.ts#L83)

Additional verification options.
