# CookieOptions

Defined in: [siwx-server/src/types.ts:191](https://github.com/TuwaIO/siwx/blob/main/packages/siwx-server/src/types.ts#L191)

Attributes of the session cookie, used by [createSessionCookie](/packages/siwx-server/server/functions/createSessionCookie.md), [createClearCookie](/packages/siwx-server/server/functions/createClearCookie.md) and the
`@tuwaio/siwx-server/next` handlers. The cookie is always `HttpOnly`.

## Properties

### domain?

> `optional` **domain?**: `string`

Defined in: [siwx-server/src/types.ts:211](https://github.com/TuwaIO/siwx/blob/main/packages/siwx-server/src/types.ts#L211)

The cookie domain.

***

### maxAge?

> `optional` **maxAge?**: `number`

Defined in: [siwx-server/src/types.ts:202](https://github.com/TuwaIO/siwx/blob/main/packages/siwx-server/src/types.ts#L202)

`Max-Age` in seconds. [createSessionCookie](/packages/siwx-server/server/functions/createSessionCookie.md) defaults to 604800 (7 days). The handlers use their
`ttlSeconds` instead, and fall back to this value when `ttlSeconds` is not set.

#### Default

```ts
604800
```

***

### name?

> `optional` **name?**: `string`

Defined in: [siwx-server/src/types.ts:196](https://github.com/TuwaIO/siwx/blob/main/packages/siwx-server/src/types.ts#L196)

The name of the cookie.

#### Default

```ts
"siwx-session-v2"
```

***

### path?

> `optional` **path?**: `string`

Defined in: [siwx-server/src/types.ts:207](https://github.com/TuwaIO/siwx/blob/main/packages/siwx-server/src/types.ts#L207)

The cookie path.

#### Default

```ts
"/"
```

***

### sameSite?

> `optional` **sameSite?**: `"Strict"` \| `"Lax"` \| `"None"`

Defined in: [siwx-server/src/types.ts:221](https://github.com/TuwaIO/siwx/blob/main/packages/siwx-server/src/types.ts#L221)

The SameSite policy.

#### Default

```ts
"Strict"
```

***

### secure?

> `optional` **secure?**: `boolean`

Defined in: [siwx-server/src/types.ts:216](https://github.com/TuwaIO/siwx/blob/main/packages/siwx-server/src/types.ts#L216)

Whether to set the Secure flag.

#### Default

```ts
true
```
