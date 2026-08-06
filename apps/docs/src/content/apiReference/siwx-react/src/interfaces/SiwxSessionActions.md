[**API Reference — @tuwaio/siwx (CAIP-122 Authentication Layer)**](../../../README.md)

***

# SiwxSessionActions

Defined in: [packages/siwx-react/src/sessionStore.ts:43](https://github.com/TuwaIO/siwx/blob/b9b124994d5ac633a6d509fd0c9a5e5efdaac504/packages/siwx-react/src/sessionStore.ts#L43)

Actions available on the siwx session Zustand store.

## Properties

### reset

> **reset**: () => `void`

Defined in: [packages/siwx-react/src/sessionStore.ts:72](https://github.com/TuwaIO/siwx/blob/b9b124994d5ac633a6d509fd0c9a5e5efdaac504/packages/siwx-react/src/sessionStore.ts#L72)

Resets the store to `idle` and clears all session data.
Use this to log the user out.

#### Returns

`void`

***

### setAuthenticated

> **setAuthenticated**: (`parsed`) => `void`

Defined in: [packages/siwx-react/src/sessionStore.ts:60](https://github.com/TuwaIO/siwx/blob/b9b124994d5ac633a6d509fd0c9a5e5efdaac504/packages/siwx-react/src/sessionStore.ts#L60)

Sets the store to `authenticated` and stores the session.

#### Parameters

##### parsed

`SiwxMessageFields`

The verified parsed CAIP-122 message.

#### Returns

`void`

***

### setError

> **setError**: (`error`) => `void`

Defined in: [packages/siwx-react/src/sessionStore.ts:66](https://github.com/TuwaIO/siwx/blob/b9b124994d5ac633a6d509fd0c9a5e5efdaac504/packages/siwx-react/src/sessionStore.ts#L66)

Sets the store to `error` state with a message.

#### Parameters

##### error

`string`

Human-readable error description.

#### Returns

`void`

***

### setSigning

> **setSigning**: () => `void`

Defined in: [packages/siwx-react/src/sessionStore.ts:48](https://github.com/TuwaIO/siwx/blob/b9b124994d5ac633a6d509fd0c9a5e5efdaac504/packages/siwx-react/src/sessionStore.ts#L48)

Sets the store into the `signing` state.
Call this before triggering the wallet sign request.

#### Returns

`void`

***

### setVerifying

> **setVerifying**: () => `void`

Defined in: [packages/siwx-react/src/sessionStore.ts:54](https://github.com/TuwaIO/siwx/blob/b9b124994d5ac633a6d509fd0c9a5e5efdaac504/packages/siwx-react/src/sessionStore.ts#L54)

Sets the store into the `verifying` state.
Call this after the user has signed but before server verification.

#### Returns

`void`
