# StatelessDemoSiwxHandlerOptions

Defined in: [siwx-server/src/next.ts:74](https://github.com/TuwaIO/siwx/blob/main/packages/siwx-server/src/next.ts#L74)

Options of [createStatelessDemoSiwxHandler](/packages/siwx-server/next/functions/createStatelessDemoSiwxHandler.md).

## Properties

### cookieOptions?

> `optional` **cookieOptions?**: [`CookieOptions`](/packages/siwx-server/server/interfaces/CookieOptions.md)

Defined in: [siwx-server/src/next.ts:90](https://github.com/TuwaIO/siwx/blob/main/packages/siwx-server/src/next.ts#L90)

Attributes of the session cookie. `maxAge` is replaced by the token TTL.

***

### demoLimits?

> `optional` **demoLimits?**: [`StatelessDemoLimits`](/packages/siwx-server/server/interfaces/StatelessDemoLimits.md)

Defined in: [siwx-server/src/next.ts:95](https://github.com/TuwaIO/siwx/blob/main/packages/siwx-server/src/next.ts#L95)

Request limits (maximum body size of `POST /verify`).

***

### policy?

> `optional` **policy?**: [`SiwxVerificationPolicy`](/packages/siwx-server/server/interfaces/SiwxVerificationPolicy.md)

Defined in: [siwx-server/src/next.ts:85](https://github.com/TuwaIO/siwx/blob/main/packages/siwx-server/src/next.ts#L85)

Policy enforced by `POST /verify`. For the demo profile, set `expectedDomain`, `requireExpirationTime` and a
short `maxSessionLifetimeSeconds`.

***

### signingSecret

> **signingSecret**: `string`

Defined in: [siwx-server/src/next.ts:79](https://github.com/TuwaIO/siwx/blob/main/packages/siwx-server/src/next.ts#L79)

Server-only HMAC secret of at least 32 characters. Never expose it to the browser. Rotating it invalidates every
issued token.

***

### ttlSeconds?

> `optional` **ttlSeconds?**: `number`

Defined in: [siwx-server/src/next.ts:106](https://github.com/TuwaIO/siwx/blob/main/packages/siwx-server/src/next.ts#L106)

Token and cookie lifetime in seconds. Defaults to `cookieOptions.maxAge`, then to 1800 (30 minutes). A message
`expirationTime`, when present, sets the token expiry instead.

***

### verifyOptions?

> `optional` **verifyOptions?**: `Omit`\<[`ServerVerifyOptions`](/packages/siwx-server/server/interfaces/ServerVerifyOptions.md), `"policy"`\>

Defined in: [siwx-server/src/next.ts:100](https://github.com/TuwaIO/siwx/blob/main/packages/siwx-server/src/next.ts#L100)

Extra options of `verifySiwxPayload`, for example `publicClient` or `usedNonces`.
