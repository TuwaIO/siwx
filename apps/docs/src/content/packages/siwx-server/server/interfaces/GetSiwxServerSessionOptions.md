# GetSiwxServerSessionOptions

Defined in: [siwx-server/src/types.ts:248](https://github.com/TuwaIO/siwx/blob/main/packages/siwx-server/src/types.ts#L248)

Options of [getSiwxServerSession](/packages/siwx-server/server/functions/getSiwxServerSession.md).

## Properties

### cookieName?

> `optional` **cookieName?**: `string`

Defined in: [siwx-server/src/types.ts:270](https://github.com/TuwaIO/siwx/blob/main/packages/siwx-server/src/types.ts#L270)

The name of the cookie.

#### Default

```ts
"siwx-session-v2"
```

***

### cookieSource

> **cookieSource**: `string` \| `Request` \| `Headers` \| \{ `get`: `string` \| \{ `value`: `string`; \} \| `null` \| `undefined`; \} \| `null` \| `undefined`

Defined in: [siwx-server/src/types.ts:258](https://github.com/TuwaIO/siwx/blob/main/packages/siwx-server/src/types.ts#L258)

Where to read the session cookie from:
- a `Cookie` header string (`"siwx-session-v2=…; other=…"`) or the bare cookie value;
- a Web API `Request`;
- the Next.js cookie store (`await cookies()`) or any object with `get(name)` returning `{ value }` or a string;
- a Web API `Headers` object.

`null` and `undefined` resolve to no session.

***

### policy?

> `optional` **policy?**: [`SiwxVerificationPolicy`](/packages/siwx-server/server/interfaces/SiwxVerificationPolicy.md)

Defined in: [siwx-server/src/types.ts:290](https://github.com/TuwaIO/siwx/blob/main/packages/siwx-server/src/types.ts#L290)

Policy checked against the stored session. Only a subset applies: `expectedDomain`, `allowedChainIds` (exact
match, except that a Solana cluster matches under its name and its genesis-hash chain ID, so sessions signed for
`solana:devnet` stay valid) and, for durable sessions, `requireExpirationTime`; for demo tokens, expiry with
`clockSkewSeconds`.

***

### sessionStore?

> `optional` **sessionStore?**: [`SiwxSessionStore`](/packages/siwx-server/server/interfaces/SiwxSessionStore.md)

Defined in: [siwx-server/src/types.ts:276](https://github.com/TuwaIO/siwx/blob/main/packages/siwx-server/src/types.ts#L276)

Store of the durable profile. The cookie value is looked up with `sessionStore.get`. Takes precedence over
`signingSecret`.

***

### signingSecret?

> `optional` **signingSecret?**: `string`

Defined in: [siwx-server/src/types.ts:282](https://github.com/TuwaIO/siwx/blob/main/packages/siwx-server/src/types.ts#L282)

HMAC secret of the stateless demo profile. The cookie value is verified with
[verifyStatelessDemoSession](/packages/siwx-server/server/functions/verifyStatelessDemoSession.md).
