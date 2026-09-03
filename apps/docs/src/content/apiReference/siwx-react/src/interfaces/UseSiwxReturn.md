[**API Reference — @tuwaio/siwx (CAIP-122 Authentication Layer)**](../../../README.md)

***

# UseSiwxReturn

Defined in: [packages/siwx-react/src/hooks.ts:68](https://github.com/TuwaIO/siwx/blob/7a4dd6dae3d09a536e9c8ec7c5ea5bf16941b2e9/packages/siwx-react/src/hooks.ts#L68)

Return value of the `useSiwx` hook.

## Properties

### signIn

> **signIn**: (`options`) => `Promise`\<`void`\>

Defined in: [packages/siwx-react/src/hooks.ts:70](https://github.com/TuwaIO/siwx/blob/7a4dd6dae3d09a536e9c8ec7c5ea5bf16941b2e9/packages/siwx-react/src/hooks.ts#L70)

Initiates the full Sign-In With X flow: build → sign → verify.

#### Parameters

##### options

[`UseSiwxSignInOptions`](UseSiwxSignInOptions.md)

#### Returns

`Promise`\<`void`\>

***

### signOut

> **signOut**: () => `void`

Defined in: [packages/siwx-react/src/hooks.ts:72](https://github.com/TuwaIO/siwx/blob/7a4dd6dae3d09a536e9c8ec7c5ea5bf16941b2e9/packages/siwx-react/src/hooks.ts#L72)

Clears the current session. Does NOT hit any logout endpoint.

#### Returns

`void`
