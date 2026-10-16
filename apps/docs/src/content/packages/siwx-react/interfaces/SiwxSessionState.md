# SiwxSessionState

Defined in: [siwx-react/src/sessionStore.ts:38](https://github.com/TuwaIO/siwx/blob/main/packages/siwx-react/src/sessionStore.ts#L38)

State of [useSiwxSessionStore](/packages/siwx-react/variables/useSiwxSessionStore.md).

## Properties

### error

> **error**: `string` \| `null`

Defined in: [siwx-react/src/sessionStore.ts:44](https://github.com/TuwaIO/siwx/blob/main/packages/siwx-react/src/sessionStore.ts#L44)

The last error message. Set when `status` is `error`; cleared by the other actions.

***

### session

> **session**: [`SiwxClientSession`](/packages/siwx-react/interfaces/SiwxClientSession.md) \| `null`

Defined in: [siwx-react/src/sessionStore.ts:42](https://github.com/TuwaIO/siwx/blob/main/packages/siwx-react/src/sessionStore.ts#L42)

The verified session. Set when `status` becomes `authenticated`; cleared by `reset`.

***

### status

> **status**: [`SiwxStatus`](/packages/siwx-react/type-aliases/SiwxStatus.md)

Defined in: [siwx-react/src/sessionStore.ts:40](https://github.com/TuwaIO/siwx/blob/main/packages/siwx-react/src/sessionStore.ts#L40)

Current sign-in status. Starts as `idle`.
