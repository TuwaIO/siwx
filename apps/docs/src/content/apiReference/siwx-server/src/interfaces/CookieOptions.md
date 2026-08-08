[**API Reference — @tuwaio/siwx (CAIP-122 Authentication Layer)**](../../../README.md)

***

# CookieOptions

Defined in: [packages/siwx-server/src/types.ts:66](https://github.com/TuwaIO/siwx/blob/626c94cfe8fcb8d8d8caa69ff91c81d6883a0fec/packages/siwx-server/src/types.ts#L66)

Options for cookie session serialization.

## Properties

### domain?

> `optional` **domain?**: `string`

Defined in: [packages/siwx-server/src/types.ts:85](https://github.com/TuwaIO/siwx/blob/626c94cfe8fcb8d8d8caa69ff91c81d6883a0fec/packages/siwx-server/src/types.ts#L85)

The cookie domain.

***

### maxAge?

> `optional` **maxAge?**: `number`

Defined in: [packages/siwx-server/src/types.ts:76](https://github.com/TuwaIO/siwx/blob/626c94cfe8fcb8d8d8caa69ff91c81d6883a0fec/packages/siwx-server/src/types.ts#L76)

Max age in seconds. Defaults to 7 days.

#### Default

```ts
604800
```

***

### name?

> `optional` **name?**: `string`

Defined in: [packages/siwx-server/src/types.ts:71](https://github.com/TuwaIO/siwx/blob/626c94cfe8fcb8d8d8caa69ff91c81d6883a0fec/packages/siwx-server/src/types.ts#L71)

The name of the cookie.

#### Default

```ts
"siwx-session"
```

***

### path?

> `optional` **path?**: `string`

Defined in: [packages/siwx-server/src/types.ts:81](https://github.com/TuwaIO/siwx/blob/626c94cfe8fcb8d8d8caa69ff91c81d6883a0fec/packages/siwx-server/src/types.ts#L81)

The cookie path.

#### Default

```ts
"/"
```

***

### sameSite?

> `optional` **sameSite?**: `"Strict"` \| `"Lax"` \| `"None"`

Defined in: [packages/siwx-server/src/types.ts:95](https://github.com/TuwaIO/siwx/blob/626c94cfe8fcb8d8d8caa69ff91c81d6883a0fec/packages/siwx-server/src/types.ts#L95)

The SameSite policy.

#### Default

```ts
"Strict"
```

***

### secure?

> `optional` **secure?**: `boolean`

Defined in: [packages/siwx-server/src/types.ts:90](https://github.com/TuwaIO/siwx/blob/626c94cfe8fcb8d8d8caa69ff91c81d6883a0fec/packages/siwx-server/src/types.ts#L90)

Whether to set the Secure flag.

#### Default

```ts
true
```
