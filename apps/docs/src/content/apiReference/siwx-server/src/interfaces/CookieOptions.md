[**API Reference — @tuwaio/siwx (CAIP-122 Authentication Layer)**](../../../README.md)

***

# CookieOptions

Defined in: [packages/siwx-server/src/types.ts:60](https://github.com/TuwaIO/siwx/blob/09eb108718ca0fbc6fd96fa980ed6a900a00adb2/packages/siwx-server/src/types.ts#L60)

Options for cookie session serialization.

## Properties

### domain?

> `optional` **domain?**: `string`

Defined in: [packages/siwx-server/src/types.ts:79](https://github.com/TuwaIO/siwx/blob/09eb108718ca0fbc6fd96fa980ed6a900a00adb2/packages/siwx-server/src/types.ts#L79)

The cookie domain.

***

### maxAge?

> `optional` **maxAge?**: `number`

Defined in: [packages/siwx-server/src/types.ts:70](https://github.com/TuwaIO/siwx/blob/09eb108718ca0fbc6fd96fa980ed6a900a00adb2/packages/siwx-server/src/types.ts#L70)

Max age in seconds. Defaults to 7 days.

#### Default

```ts
604800
```

***

### name?

> `optional` **name?**: `string`

Defined in: [packages/siwx-server/src/types.ts:65](https://github.com/TuwaIO/siwx/blob/09eb108718ca0fbc6fd96fa980ed6a900a00adb2/packages/siwx-server/src/types.ts#L65)

The name of the cookie.

#### Default

```ts
"siwx-session"
```

***

### path?

> `optional` **path?**: `string`

Defined in: [packages/siwx-server/src/types.ts:75](https://github.com/TuwaIO/siwx/blob/09eb108718ca0fbc6fd96fa980ed6a900a00adb2/packages/siwx-server/src/types.ts#L75)

The cookie path.

#### Default

```ts
"/"
```

***

### sameSite?

> `optional` **sameSite?**: `"Strict"` \| `"Lax"` \| `"None"`

Defined in: [packages/siwx-server/src/types.ts:89](https://github.com/TuwaIO/siwx/blob/09eb108718ca0fbc6fd96fa980ed6a900a00adb2/packages/siwx-server/src/types.ts#L89)

The SameSite policy.

#### Default

```ts
"Strict"
```

***

### secure?

> `optional` **secure?**: `boolean`

Defined in: [packages/siwx-server/src/types.ts:84](https://github.com/TuwaIO/siwx/blob/09eb108718ca0fbc6fd96fa980ed6a900a00adb2/packages/siwx-server/src/types.ts#L84)

Whether to set the Secure flag.

#### Default

```ts
true
```
