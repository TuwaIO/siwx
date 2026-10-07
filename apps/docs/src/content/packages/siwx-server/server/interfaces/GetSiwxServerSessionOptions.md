# GetSiwxServerSessionOptions

Defined in: [siwx-server/src/types.ts:227](https://github.com/TuwaIO/siwx/blob/main/packages/siwx-server/src/types.ts#L227)

Options of [getSiwxServerSession](/packages/siwx-server/server/functions/getSiwxServerSession.md).

## Properties

### cookieName?

> `optional` **cookieName?**: `string`

Defined in: [siwx-server/src/types.ts:249](https://github.com/TuwaIO/siwx/blob/main/packages/siwx-server/src/types.ts#L249)

The name of the cookie.

#### Default

```ts
"siwx-session-v2"
```

***

### cookieSource

> **cookieSource**: `string` \| `Request` \| `Headers` \| \{ `get`: `string` \| \{ `value`: `string`; \} \| `null` \| `undefined`; \} \| `null` \| `undefined`

Defined in: [siwx-server/src/types.ts:237](https://github.com/TuwaIO/siwx/blob/main/packages/siwx-server/src/types.ts#L237)

Where to read the session cookie from:
- a `Cookie` header string (`"siwx-session-v2=…; other=…"`) or the bare cookie value;
- a Web API `Request`;
- the Next.js cookie store (`await cookies()`) or any object with `get(name)` returning `{ value }` or a string;
- a Web API `Headers` object.

`null` and `undefined` resolve to no session.

***

### policy?

> `optional` **policy?**: [`SiwxVerificationPolicy`](/packages/siwx-server/server/interfaces/SiwxVerificationPolicy.md)

Defined in: [siwx-server/src/types.ts:269](https://github.com/TuwaIO/siwx/blob/main/packages/siwx-server/src/types.ts#L269)

Policy checked against the stored session. Only a subset applies: `expectedDomain`, `allowedChainIds` (exact
match, except that a Solana cluster matches under its name and its genesis-hash chain ID, so sessions signed for
`solana:devnet` stay valid) and, for durable sessions, `requireExpirationTime`; for demo tokens, expiry with
`clockSkewSeconds`.

***

### sessionStore?

> `optional` **sessionStore?**: [`SiwxSessionStore`](/packages/siwx-server/server/interfaces/SiwxSessionStore.md)

Defined in: [siwx-server/src/types.ts:255](https://github.com/TuwaIO/siwx/blob/main/packages/siwx-server/src/types.ts#L255)

Store of the durable profile. The cookie value is looked up with `sessionStore.get`. Takes precedence over
`signingSecret`.

***

### signingSecret?

> `optional` **signingSecret?**: `string`

Defined in: [siwx-server/src/types.ts:261](https://github.com/TuwaIO/siwx/blob/main/packages/siwx-server/src/types.ts#L261)

HMAC secret of the stateless demo profile. The cookie value is verified with
[verifyStatelessDemoSession](/packages/siwx-server/server/functions/verifyStatelessDemoSession.md).
