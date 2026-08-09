[**API Reference — @tuwaio/siwx (CAIP-122 Authentication Layer)**](../../../README.md)

***

# SiwxSessionState

Defined in: [packages/siwx-react/src/sessionStore.ts:30](https://github.com/TuwaIO/siwx/blob/488faa95116da4d0322aa135f4e3d31118aa51c6/packages/siwx-react/src/sessionStore.ts#L30)

The shape of the siwx session Zustand store state.

## Properties

### error

> **error**: `string` \| `null`

Defined in: [packages/siwx-react/src/sessionStore.ts:36](https://github.com/TuwaIO/siwx/blob/488faa95116da4d0322aa135f4e3d31118aa51c6/packages/siwx-react/src/sessionStore.ts#L36)

The last error message, present when `status` is 'error'.

***

### session

> **session**: [`SiwxClientSession`](SiwxClientSession.md) \| `null`

Defined in: [packages/siwx-react/src/sessionStore.ts:34](https://github.com/TuwaIO/siwx/blob/488faa95116da4d0322aa135f4e3d31118aa51c6/packages/siwx-react/src/sessionStore.ts#L34)

The active session, present when `status` is 'authenticated'.

***

### status

> **status**: [`SiwxStatus`](../type-aliases/SiwxStatus.md)

Defined in: [packages/siwx-react/src/sessionStore.ts:32](https://github.com/TuwaIO/siwx/blob/488faa95116da4d0322aa135f4e3d31118aa51c6/packages/siwx-react/src/sessionStore.ts#L32)

Current authentication status.
