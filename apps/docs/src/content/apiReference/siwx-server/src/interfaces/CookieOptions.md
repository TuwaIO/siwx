[**API Reference — @tuwaio/siwx (CAIP-122 Authentication Layer)**](../../../README.md)

***

# CookieOptions

Defined in: [packages/siwx-server/src/types.ts:169](https://github.com/TuwaIO/siwx/blob/21b3a05b39d40806567e8859c0d7699b6b50336c/packages/siwx-server/src/types.ts#L169)

Options for cookie session serialization.

## Properties

### domain?

> `optional` **domain?**: `string`

Defined in: [packages/siwx-server/src/types.ts:188](https://github.com/TuwaIO/siwx/blob/21b3a05b39d40806567e8859c0d7699b6b50336c/packages/siwx-server/src/types.ts#L188)

The cookie domain.

***

### maxAge?

> `optional` **maxAge?**: `number`

Defined in: [packages/siwx-server/src/types.ts:179](https://github.com/TuwaIO/siwx/blob/21b3a05b39d40806567e8859c0d7699b6b50336c/packages/siwx-server/src/types.ts#L179)

Max age in seconds. Defaults to 7 days for durable, 30 minutes for demo.

#### Default

```ts
604800
```

***

### name?

> `optional` **name?**: `string`

Defined in: [packages/siwx-server/src/types.ts:174](https://github.com/TuwaIO/siwx/blob/21b3a05b39d40806567e8859c0d7699b6b50336c/packages/siwx-server/src/types.ts#L174)

The name of the cookie.

#### Default

```ts
"siwx-session-v2"
```

***

### path?

> `optional` **path?**: `string`

Defined in: [packages/siwx-server/src/types.ts:184](https://github.com/TuwaIO/siwx/blob/21b3a05b39d40806567e8859c0d7699b6b50336c/packages/siwx-server/src/types.ts#L184)

The cookie path.

#### Default

```ts
"/"
```

***

### sameSite?

> `optional` **sameSite?**: `"Strict"` \| `"Lax"` \| `"None"`

Defined in: [packages/siwx-server/src/types.ts:198](https://github.com/TuwaIO/siwx/blob/21b3a05b39d40806567e8859c0d7699b6b50336c/packages/siwx-server/src/types.ts#L198)

The SameSite policy.

#### Default

```ts
"Strict"
```

***

### secure?

> `optional` **secure?**: `boolean`

Defined in: [packages/siwx-server/src/types.ts:193](https://github.com/TuwaIO/siwx/blob/21b3a05b39d40806567e8859c0d7699b6b50336c/packages/siwx-server/src/types.ts#L193)

Whether to set the Secure flag.

#### Default

```ts
true
```
