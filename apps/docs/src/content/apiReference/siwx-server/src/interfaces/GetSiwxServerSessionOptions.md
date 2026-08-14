[**API Reference — @tuwaio/siwx (CAIP-122 Authentication Layer)**](../../../README.md)

***

# GetSiwxServerSessionOptions

Defined in: [packages/siwx-server/src/types.ts:204](https://github.com/TuwaIO/siwx/blob/5afdbf8444bc2b94d7f938774996543e40e8ee51/packages/siwx-server/src/types.ts#L204)

Options for the `getSiwxServerSession` helper function.

## Properties

### cookieName?

> `optional` **cookieName?**: `string`

Defined in: [packages/siwx-server/src/types.ts:224](https://github.com/TuwaIO/siwx/blob/5afdbf8444bc2b94d7f938774996543e40e8ee51/packages/siwx-server/src/types.ts#L224)

The name of the cookie.

#### Default

```ts
"siwx-session-v2"
```

***

### cookieSource

> **cookieSource**: `string` \| `Request` \| `Headers` \| \{ `get`: `string` \| \{ `value`: `string`; \} \| `null` \| `undefined`; \} \| `null` \| `undefined`

Defined in: [packages/siwx-server/src/types.ts:212](https://github.com/TuwaIO/siwx/blob/5afdbf8444bc2b94d7f938774996543e40e8ee51/packages/siwx-server/src/types.ts#L212)

Cookie source:
- A raw Cookie string (e.g. `req.headers.get('cookie')` or `"siwx-session-v2=xyz"`)
- A Next.js ReadonlyRequestCookies object (from `await cookies()`)
- A Web API `Request` or `Headers` object
- Any object with a `get(name)` method

***

### policy?

> `optional` **policy?**: [`SiwxVerificationPolicy`](SiwxVerificationPolicy.md)

Defined in: [packages/siwx-server/src/types.ts:239](https://github.com/TuwaIO/siwx/blob/5afdbf8444bc2b94d7f938774996543e40e8ee51/packages/siwx-server/src/types.ts#L239)

Optional verification policy to validate the session.

***

### sessionStore?

> `optional` **sessionStore?**: [`SiwxSessionStore`](SiwxSessionStore.md)

Defined in: [packages/siwx-server/src/types.ts:229](https://github.com/TuwaIO/siwx/blob/5afdbf8444bc2b94d7f938774996543e40e8ee51/packages/siwx-server/src/types.ts#L229)

Durable session store (for production durable sessions).

***

### signingSecret?

> `optional` **signingSecret?**: `string`

Defined in: [packages/siwx-server/src/types.ts:234](https://github.com/TuwaIO/siwx/blob/5afdbf8444bc2b94d7f938774996543e40e8ee51/packages/siwx-server/src/types.ts#L234)

Server HMAC secret key (for stateless demo sessions).
