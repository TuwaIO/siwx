[**API Reference — @tuwaio/siwx (CAIP-122 Authentication Layer)**](../../../README.md)

***

# UseSiwxReturn

Defined in: [packages/siwx-react/src/hooks.ts:62](https://github.com/TuwaIO/siwx/blob/3e92d2c12c74ad4820f3f675f56b978c23099c12/packages/siwx-react/src/hooks.ts#L62)

Return value of the `useSiwx` hook.

## Properties

### signIn

> **signIn**: (`options`) => `Promise`\<`void`\>

Defined in: [packages/siwx-react/src/hooks.ts:64](https://github.com/TuwaIO/siwx/blob/3e92d2c12c74ad4820f3f675f56b978c23099c12/packages/siwx-react/src/hooks.ts#L64)

Initiates the full Sign-In With X flow: build → sign → verify.

#### Parameters

##### options

[`UseSiwxSignInOptions`](UseSiwxSignInOptions.md)

#### Returns

`Promise`\<`void`\>

***

### signOut

> **signOut**: () => `void`

Defined in: [packages/siwx-react/src/hooks.ts:66](https://github.com/TuwaIO/siwx/blob/3e92d2c12c74ad4820f3f675f56b978c23099c12/packages/siwx-react/src/hooks.ts#L66)

Clears the current session. Does NOT hit any logout endpoint.

#### Returns

`void`
