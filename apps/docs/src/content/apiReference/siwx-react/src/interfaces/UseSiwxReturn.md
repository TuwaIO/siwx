[**API Reference — @tuwaio/siwx (CAIP-122 Authentication Layer)**](../../../README.md)

***

# UseSiwxReturn

Defined in: [packages/siwx-react/src/hooks.ts:68](https://github.com/TuwaIO/siwx/blob/83013b6156828e4328756382b00fca539cc26a69/packages/siwx-react/src/hooks.ts#L68)

Return value of the `useSiwx` hook.

## Properties

### signIn

> **signIn**: (`options`) => `Promise`\<`void`\>

Defined in: [packages/siwx-react/src/hooks.ts:70](https://github.com/TuwaIO/siwx/blob/83013b6156828e4328756382b00fca539cc26a69/packages/siwx-react/src/hooks.ts#L70)

Initiates the full Sign-In With X flow: build → sign → verify.

#### Parameters

##### options

[`UseSiwxSignInOptions`](UseSiwxSignInOptions.md)

#### Returns

`Promise`\<`void`\>

***

### signOut

> **signOut**: () => `void`

Defined in: [packages/siwx-react/src/hooks.ts:72](https://github.com/TuwaIO/siwx/blob/83013b6156828e4328756382b00fca539cc26a69/packages/siwx-react/src/hooks.ts#L72)

Clears the current session. Does NOT hit any logout endpoint.

#### Returns

`void`
