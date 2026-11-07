# SiwxSessionState

Defined in: [siwx-react/src/sessionStore.ts:39](https://github.com/TuwaIO/siwx/blob/main/packages/siwx-react/src/sessionStore.ts#L39)

State of [useSiwxSessionStore](/packages/siwx-react/variables/useSiwxSessionStore.md).

## Properties

### error

> **error**: `string` \| `null`

Defined in: [siwx-react/src/sessionStore.ts:45](https://github.com/TuwaIO/siwx/blob/main/packages/siwx-react/src/sessionStore.ts#L45)

The last error message. Set when `status` is `error`; cleared by the other actions.

***

### session

> **session**: [`SiwxClientSession`](/packages/siwx-react/interfaces/SiwxClientSession.md) \| `null`

Defined in: [siwx-react/src/sessionStore.ts:43](https://github.com/TuwaIO/siwx/blob/main/packages/siwx-react/src/sessionStore.ts#L43)

The verified session. Set when `status` becomes `authenticated`; cleared by `reset`.

***

### status

> **status**: [`SiwxStatus`](/packages/siwx-react/type-aliases/SiwxStatus.md)

Defined in: [siwx-react/src/sessionStore.ts:41](https://github.com/TuwaIO/siwx/blob/main/packages/siwx-react/src/sessionStore.ts#L41)

Current sign-in status. Starts as `idle`.
