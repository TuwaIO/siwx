[**API Reference — @tuwaio/siwx (CAIP-122 Authentication Layer)**](../../../README.md)

***

# CookieOptions

Defined in: [packages/siwx-server/src/types.ts:66](https://github.com/TuwaIO/siwx/blob/bac8be290114bb4720f42e8f92d70040e76d06fe/packages/siwx-server/src/types.ts#L66)

Options for cookie session serialization.

## Properties

### domain?

> `optional` **domain?**: `string`

Defined in: [packages/siwx-server/src/types.ts:85](https://github.com/TuwaIO/siwx/blob/bac8be290114bb4720f42e8f92d70040e76d06fe/packages/siwx-server/src/types.ts#L85)

The cookie domain.

***

### maxAge?

> `optional` **maxAge?**: `number`

Defined in: [packages/siwx-server/src/types.ts:76](https://github.com/TuwaIO/siwx/blob/bac8be290114bb4720f42e8f92d70040e76d06fe/packages/siwx-server/src/types.ts#L76)

Max age in seconds. Defaults to 7 days.

#### Default

```ts
604800
```

***

### name?

> `optional` **name?**: `string`

Defined in: [packages/siwx-server/src/types.ts:71](https://github.com/TuwaIO/siwx/blob/bac8be290114bb4720f42e8f92d70040e76d06fe/packages/siwx-server/src/types.ts#L71)

The name of the cookie.

#### Default

```ts
"siwx-session"
```

***

### path?

> `optional` **path?**: `string`

Defined in: [packages/siwx-server/src/types.ts:81](https://github.com/TuwaIO/siwx/blob/bac8be290114bb4720f42e8f92d70040e76d06fe/packages/siwx-server/src/types.ts#L81)

The cookie path.

#### Default

```ts
"/"
```

***

### sameSite?

> `optional` **sameSite?**: `"Strict"` \| `"Lax"` \| `"None"`

Defined in: [packages/siwx-server/src/types.ts:95](https://github.com/TuwaIO/siwx/blob/bac8be290114bb4720f42e8f92d70040e76d06fe/packages/siwx-server/src/types.ts#L95)

The SameSite policy.

#### Default

```ts
"Strict"
```

***

### secure?

> `optional` **secure?**: `boolean`

Defined in: [packages/siwx-server/src/types.ts:90](https://github.com/TuwaIO/siwx/blob/bac8be290114bb4720f42e8f92d70040e76d06fe/packages/siwx-server/src/types.ts#L90)

Whether to set the Secure flag.

#### Default

```ts
true
```
