# SiwxSessionActions

Defined in: [siwx-react/src/sessionStore.ts:45](https://github.com/TuwaIO/siwx/blob/main/packages/siwx-react/src/sessionStore.ts#L45)

Actions of [useSiwxSessionStore](/packages/siwx-react/variables/useSiwxSessionStore.md). [useSiwx](/packages/siwx-react/functions/useSiwx.md) calls them for you; call them directly only to drive
a custom sign-in flow.

## Properties

### reset

> **reset**: () => `void`

Defined in: [siwx-react/src/sessionStore.ts:81](https://github.com/TuwaIO/siwx/blob/main/packages/siwx-react/src/sessionStore.ts#L81)

Resets the store to `idle` and clears the session and error. Does not call the server; clear the server session
cookie separately (for example `DELETE /api/siwx/session`).

#### Returns

`void`

***

### setAuthenticated

> **setAuthenticated**: (`parsed`) => `void`

Defined in: [siwx-react/src/sessionStore.ts:69](https://github.com/TuwaIO/siwx/blob/main/packages/siwx-react/src/sessionStore.ts#L69)

Sets the store to `authenticated` and stores `address`, `chainId`, `issuedAt`, `expirationTime` and `domain` of
the message as the session.

#### Parameters

##### parsed

[`ParsedSiwxMessage`](/packages/siwx-react/type-aliases/ParsedSiwxMessage.md)

The verified CAIP-122 message.

#### Returns

`void`

***

### setBuilding

> **setBuilding**: () => `void`

Defined in: [siwx-react/src/sessionStore.ts:50](https://github.com/TuwaIO/siwx/blob/main/packages/siwx-react/src/sessionStore.ts#L50)

Sets the store into the `building` state (getting the nonce and building the message).
Call this when a sign-in starts.

#### Returns

`void`

***

### setError

> **setError**: (`error`) => `void`

Defined in: [siwx-react/src/sessionStore.ts:75](https://github.com/TuwaIO/siwx/blob/main/packages/siwx-react/src/sessionStore.ts#L75)

Sets the store to `error` with a message. The current `session` is kept.

#### Parameters

##### error

`string`

Human-readable error description.

#### Returns

`void`

***

### setSigning

> **setSigning**: () => `void`

Defined in: [siwx-react/src/sessionStore.ts:56](https://github.com/TuwaIO/siwx/blob/main/packages/siwx-react/src/sessionStore.ts#L56)

Sets the store into the `signing` state.
Call this before triggering the wallet sign request.

#### Returns

`void`

***

### setVerifying

> **setVerifying**: () => `void`

Defined in: [siwx-react/src/sessionStore.ts:62](https://github.com/TuwaIO/siwx/blob/main/packages/siwx-react/src/sessionStore.ts#L62)

Sets the store into the `verifying` state.
Call this after the user has signed but before server verification.

#### Returns

`void`
