[**API Reference — @tuwaio/siwx (CAIP-122 Authentication Layer)**](../../../README.md)

***

# SiwxSessionState

Defined in: [packages/siwx-react/src/sessionStore.ts:31](https://github.com/TuwaIO/siwx/blob/8e4b42d7efd91d50100ad87a03ed6922bb680d68/packages/siwx-react/src/sessionStore.ts#L31)

The shape of the siwx session Zustand store state.

## Properties

### error

> **error**: `string` \| `null`

Defined in: [packages/siwx-react/src/sessionStore.ts:37](https://github.com/TuwaIO/siwx/blob/8e4b42d7efd91d50100ad87a03ed6922bb680d68/packages/siwx-react/src/sessionStore.ts#L37)

The last error message, present when `status` is 'error'.

***

### session

> **session**: [`SiwxClientSession`](SiwxClientSession.md) \| `null`

Defined in: [packages/siwx-react/src/sessionStore.ts:35](https://github.com/TuwaIO/siwx/blob/8e4b42d7efd91d50100ad87a03ed6922bb680d68/packages/siwx-react/src/sessionStore.ts#L35)

The active session, present when `status` is 'authenticated'.

***

### status

> **status**: `SiwxStatus`

Defined in: [packages/siwx-react/src/sessionStore.ts:33](https://github.com/TuwaIO/siwx/blob/8e4b42d7efd91d50100ad87a03ed6922bb680d68/packages/siwx-react/src/sessionStore.ts#L33)

Current authentication status.
