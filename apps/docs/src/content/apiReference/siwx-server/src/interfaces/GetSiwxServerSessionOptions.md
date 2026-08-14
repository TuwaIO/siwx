[**API Reference — @tuwaio/siwx (CAIP-122 Authentication Layer)**](../../../README.md)

***

# GetSiwxServerSessionOptions

Defined in: [packages/siwx-server/src/types.ts:199](https://github.com/TuwaIO/siwx/blob/3e92d2c12c74ad4820f3f675f56b978c23099c12/packages/siwx-server/src/types.ts#L199)

Options for the `getSiwxServerSession` helper function.

## Properties

### cookieName?

> `optional` **cookieName?**: `string`

Defined in: [packages/siwx-server/src/types.ts:219](https://github.com/TuwaIO/siwx/blob/3e92d2c12c74ad4820f3f675f56b978c23099c12/packages/siwx-server/src/types.ts#L219)

The name of the cookie.

#### Default

```ts
"siwx-session-v2"
```

***

### cookieSource

> **cookieSource**: `string` \| `Request` \| `Headers` \| \{ `get`: `string` \| \{ `value`: `string`; \} \| `null` \| `undefined`; \} \| `null` \| `undefined`

Defined in: [packages/siwx-server/src/types.ts:207](https://github.com/TuwaIO/siwx/blob/3e92d2c12c74ad4820f3f675f56b978c23099c12/packages/siwx-server/src/types.ts#L207)

Cookie source:
- A raw Cookie string (e.g. `req.headers.get('cookie')` or `"siwx-session-v2=xyz"`)
- A Next.js ReadonlyRequestCookies object (from `await cookies()`)
- A Web API `Request` or `Headers` object
- Any object with a `get(name)` method

***

### policy?

> `optional` **policy?**: [`SiwxVerificationPolicy`](SiwxVerificationPolicy.md)

Defined in: [packages/siwx-server/src/types.ts:234](https://github.com/TuwaIO/siwx/blob/3e92d2c12c74ad4820f3f675f56b978c23099c12/packages/siwx-server/src/types.ts#L234)

Optional verification policy to validate the session.

***

### sessionStore?

> `optional` **sessionStore?**: [`SiwxSessionStore`](SiwxSessionStore.md)

Defined in: [packages/siwx-server/src/types.ts:224](https://github.com/TuwaIO/siwx/blob/3e92d2c12c74ad4820f3f675f56b978c23099c12/packages/siwx-server/src/types.ts#L224)

Durable session store (for production durable sessions).

***

### signingSecret?

> `optional` **signingSecret?**: `string`

Defined in: [packages/siwx-server/src/types.ts:229](https://github.com/TuwaIO/siwx/blob/3e92d2c12c74ad4820f3f675f56b978c23099c12/packages/siwx-server/src/types.ts#L229)

Server HMAC secret key (for stateless demo sessions).
