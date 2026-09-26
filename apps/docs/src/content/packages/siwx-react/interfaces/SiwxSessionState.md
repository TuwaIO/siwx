# SiwxSessionState

Defined in: [siwx-react/src/sessionStore.ts:32](https://github.com/TuwaIO/siwx/blob/main/packages/siwx-react/src/sessionStore.ts#L32)

State of [useSiwxSessionStore](/packages/siwx-react/variables/useSiwxSessionStore.md).

## Properties

### error

> **error**: `string` \| `null`

Defined in: [siwx-react/src/sessionStore.ts:38](https://github.com/TuwaIO/siwx/blob/main/packages/siwx-react/src/sessionStore.ts#L38)

The last error message. Set when `status` is `error`; cleared by the other actions.

***

### session

> **session**: [`SiwxClientSession`](/packages/siwx-react/interfaces/SiwxClientSession.md) \| `null`

Defined in: [siwx-react/src/sessionStore.ts:36](https://github.com/TuwaIO/siwx/blob/main/packages/siwx-react/src/sessionStore.ts#L36)

The verified session. Set when `status` becomes `authenticated`; cleared by `reset`.

***

### status

> **status**: [`SiwxStatus`](/packages/siwx-react/type-aliases/SiwxStatus.md)

Defined in: [siwx-react/src/sessionStore.ts:34](https://github.com/TuwaIO/siwx/blob/main/packages/siwx-react/src/sessionStore.ts#L34)

Current sign-in status. Starts as `idle`.
