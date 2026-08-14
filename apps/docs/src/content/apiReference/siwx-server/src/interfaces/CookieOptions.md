[**API Reference — @tuwaio/siwx (CAIP-122 Authentication Layer)**](../../../README.md)

***

# CookieOptions

Defined in: [packages/siwx-server/src/types.ts:164](https://github.com/TuwaIO/siwx/blob/bbc740ccb7f405b75bd0d4e5a1bc973b1e131514/packages/siwx-server/src/types.ts#L164)

Options for cookie session serialization.

## Properties

### domain?

> `optional` **domain?**: `string`

Defined in: [packages/siwx-server/src/types.ts:183](https://github.com/TuwaIO/siwx/blob/bbc740ccb7f405b75bd0d4e5a1bc973b1e131514/packages/siwx-server/src/types.ts#L183)

The cookie domain.

***

### maxAge?

> `optional` **maxAge?**: `number`

Defined in: [packages/siwx-server/src/types.ts:174](https://github.com/TuwaIO/siwx/blob/bbc740ccb7f405b75bd0d4e5a1bc973b1e131514/packages/siwx-server/src/types.ts#L174)

Max age in seconds. Defaults to 7 days for durable, 30 minutes for demo.

#### Default

```ts
604800
```

***

### name?

> `optional` **name?**: `string`

Defined in: [packages/siwx-server/src/types.ts:169](https://github.com/TuwaIO/siwx/blob/bbc740ccb7f405b75bd0d4e5a1bc973b1e131514/packages/siwx-server/src/types.ts#L169)

The name of the cookie.

#### Default

```ts
"siwx-session-v2"
```

***

### path?

> `optional` **path?**: `string`

Defined in: [packages/siwx-server/src/types.ts:179](https://github.com/TuwaIO/siwx/blob/bbc740ccb7f405b75bd0d4e5a1bc973b1e131514/packages/siwx-server/src/types.ts#L179)

The cookie path.

#### Default

```ts
"/"
```

***

### sameSite?

> `optional` **sameSite?**: `"Strict"` \| `"Lax"` \| `"None"`

Defined in: [packages/siwx-server/src/types.ts:193](https://github.com/TuwaIO/siwx/blob/bbc740ccb7f405b75bd0d4e5a1bc973b1e131514/packages/siwx-server/src/types.ts#L193)

The SameSite policy.

#### Default

```ts
"Strict"
```

***

### secure?

> `optional` **secure?**: `boolean`

Defined in: [packages/siwx-server/src/types.ts:188](https://github.com/TuwaIO/siwx/blob/bbc740ccb7f405b75bd0d4e5a1bc973b1e131514/packages/siwx-server/src/types.ts#L188)

Whether to set the Secure flag.

#### Default

```ts
true
```
