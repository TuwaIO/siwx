# UseSiwxReturn

Defined in: [siwx-react/src/hooks.ts:71](https://github.com/TuwaIO/siwx/blob/main/packages/siwx-react/src/hooks.ts#L71)

Return value of [useSiwx](/packages/siwx-react/functions/useSiwx.md).

## Properties

### signIn

> **signIn**: (`options`) => `Promise`\<`void`\>

Defined in: [siwx-react/src/hooks.ts:76](https://github.com/TuwaIO/siwx/blob/main/packages/siwx-react/src/hooks.ts#L76)

Runs the sign-in flow (nonce → build → sign → verify) and updates the store. The promise resolves when the flow
ends: failures are caught and reported through the store `error` and `onError` instead of rejecting.

#### Parameters

##### options

[`UseSiwxSignInOptions`](/packages/siwx-react/interfaces/UseSiwxSignInOptions.md)

#### Returns

`Promise`\<`void`\>

***

### signOut

> **signOut**: () => `void`

Defined in: [siwx-react/src/hooks.ts:78](https://github.com/TuwaIO/siwx/blob/main/packages/siwx-react/src/hooks.ts#L78)

Resets the store to `idle` and clears the saved session. Does not call any server endpoint.

#### Returns

`void`
