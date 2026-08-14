[**API Reference — @tuwaio/siwx (CAIP-122 Authentication Layer)**](../../../README.md)

***

# SiwxSessionActions

Defined in: [packages/siwx-react/src/sessionStore.ts:42](https://github.com/TuwaIO/siwx/blob/bbc740ccb7f405b75bd0d4e5a1bc973b1e131514/packages/siwx-react/src/sessionStore.ts#L42)

Actions available on the siwx session Zustand store.

## Properties

### reset

> **reset**: () => `void`

Defined in: [packages/siwx-react/src/sessionStore.ts:71](https://github.com/TuwaIO/siwx/blob/bbc740ccb7f405b75bd0d4e5a1bc973b1e131514/packages/siwx-react/src/sessionStore.ts#L71)

Resets the store to `idle` and clears all session data.
Use this to log the user out.

#### Returns

`void`

***

### setAuthenticated

> **setAuthenticated**: (`parsed`) => `void`

Defined in: [packages/siwx-react/src/sessionStore.ts:59](https://github.com/TuwaIO/siwx/blob/bbc740ccb7f405b75bd0d4e5a1bc973b1e131514/packages/siwx-react/src/sessionStore.ts#L59)

Sets the store to `authenticated` and stores the session.

#### Parameters

##### parsed

[`SiwxMessageFields`](SiwxMessageFields.md)

The verified parsed CAIP-122 message.

#### Returns

`void`

***

### setError

> **setError**: (`error`) => `void`

Defined in: [packages/siwx-react/src/sessionStore.ts:65](https://github.com/TuwaIO/siwx/blob/bbc740ccb7f405b75bd0d4e5a1bc973b1e131514/packages/siwx-react/src/sessionStore.ts#L65)

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

Defined in: [packages/siwx-react/src/sessionStore.ts:47](https://github.com/TuwaIO/siwx/blob/bbc740ccb7f405b75bd0d4e5a1bc973b1e131514/packages/siwx-react/src/sessionStore.ts#L47)

Sets the store into the `signing` state.
Call this before triggering the wallet sign request.

#### Returns

`void`

***

### setVerifying

> **setVerifying**: () => `void`

Defined in: [packages/siwx-react/src/sessionStore.ts:53](https://github.com/TuwaIO/siwx/blob/bbc740ccb7f405b75bd0d4e5a1bc973b1e131514/packages/siwx-react/src/sessionStore.ts#L53)

Sets the store into the `verifying` state.
Call this after the user has signed but before server verification.

#### Returns

`void`
