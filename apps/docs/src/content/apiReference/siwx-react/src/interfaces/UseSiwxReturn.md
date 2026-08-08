[**API Reference — @tuwaio/siwx (CAIP-122 Authentication Layer)**](../../../README.md)

***

# UseSiwxReturn

Defined in: [packages/siwx-react/src/hooks.ts:48](https://github.com/TuwaIO/siwx/blob/25e4a0067650f7a94ad6029e68a5c6fc790192ab/packages/siwx-react/src/hooks.ts#L48)

Return value of the `useSiwx` hook.

## Properties

### signIn

> **signIn**: (`options`) => `Promise`\<`void`\>

Defined in: [packages/siwx-react/src/hooks.ts:50](https://github.com/TuwaIO/siwx/blob/25e4a0067650f7a94ad6029e68a5c6fc790192ab/packages/siwx-react/src/hooks.ts#L50)

Initiates the full Sign-In With X flow: build → sign → verify.

#### Parameters

##### options

[`UseSiwxSignInOptions`](UseSiwxSignInOptions.md)

#### Returns

`Promise`\<`void`\>

***

### signOut

> **signOut**: () => `void`

Defined in: [packages/siwx-react/src/hooks.ts:52](https://github.com/TuwaIO/siwx/blob/25e4a0067650f7a94ad6029e68a5c6fc790192ab/packages/siwx-react/src/hooks.ts#L52)

Clears the current session. Does NOT hit any logout endpoint.

#### Returns

`void`
