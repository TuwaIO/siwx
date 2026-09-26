# CookieOptions

Defined in: [siwx-server/src/types.ts:189](https://github.com/TuwaIO/siwx/blob/main/packages/siwx-server/src/types.ts#L189)

Attributes of the session cookie, used by [createSessionCookie](/packages/siwx-server/server/functions/createSessionCookie.md), [createClearCookie](/packages/siwx-server/server/functions/createClearCookie.md) and the
`@tuwaio/siwx-server/next` handlers. The cookie is always `HttpOnly`.

## Properties

### domain?

> `optional` **domain?**: `string`

Defined in: [siwx-server/src/types.ts:209](https://github.com/TuwaIO/siwx/blob/main/packages/siwx-server/src/types.ts#L209)

The cookie domain.

***

### maxAge?

> `optional` **maxAge?**: `number`

Defined in: [siwx-server/src/types.ts:200](https://github.com/TuwaIO/siwx/blob/main/packages/siwx-server/src/types.ts#L200)

`Max-Age` in seconds. [createSessionCookie](/packages/siwx-server/server/functions/createSessionCookie.md) defaults to 604800 (7 days). The handlers use their
`ttlSeconds` instead, and fall back to this value when `ttlSeconds` is not set.

#### Default

```ts
604800
```

***

### name?

> `optional` **name?**: `string`

Defined in: [siwx-server/src/types.ts:194](https://github.com/TuwaIO/siwx/blob/main/packages/siwx-server/src/types.ts#L194)

The name of the cookie.

#### Default

```ts
"siwx-session-v2"
```

***

### path?

> `optional` **path?**: `string`

Defined in: [siwx-server/src/types.ts:205](https://github.com/TuwaIO/siwx/blob/main/packages/siwx-server/src/types.ts#L205)

The cookie path.

#### Default

```ts
"/"
```

***

### sameSite?

> `optional` **sameSite?**: `"Strict"` \| `"Lax"` \| `"None"`

Defined in: [siwx-server/src/types.ts:219](https://github.com/TuwaIO/siwx/blob/main/packages/siwx-server/src/types.ts#L219)

The SameSite policy.

#### Default

```ts
"Strict"
```

***

### secure?

> `optional` **secure?**: `boolean`

Defined in: [siwx-server/src/types.ts:214](https://github.com/TuwaIO/siwx/blob/main/packages/siwx-server/src/types.ts#L214)

Whether to set the Secure flag.

#### Default

```ts
true
```
