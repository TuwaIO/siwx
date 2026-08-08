[**API Reference — @tuwaio/siwx (CAIP-122 Authentication Layer)**](../../../README.md)

***

# SiwxSessionState

Defined in: [packages/siwx-react/src/sessionStore.ts:31](https://github.com/TuwaIO/siwx/blob/ecff9ffa6386dee5a576efabec2ed72f03dde624/packages/siwx-react/src/sessionStore.ts#L31)

The shape of the siwx session Zustand store state.

## Properties

### error

> **error**: `string` \| `null`

Defined in: [packages/siwx-react/src/sessionStore.ts:37](https://github.com/TuwaIO/siwx/blob/ecff9ffa6386dee5a576efabec2ed72f03dde624/packages/siwx-react/src/sessionStore.ts#L37)

The last error message, present when `status` is 'error'.

***

### session

> **session**: [`SiwxClientSession`](SiwxClientSession.md) \| `null`

Defined in: [packages/siwx-react/src/sessionStore.ts:35](https://github.com/TuwaIO/siwx/blob/ecff9ffa6386dee5a576efabec2ed72f03dde624/packages/siwx-react/src/sessionStore.ts#L35)

The active session, present when `status` is 'authenticated'.

***

### status

> **status**: [`SiwxStatus`](../type-aliases/SiwxStatus.md)

Defined in: [packages/siwx-react/src/sessionStore.ts:33](https://github.com/TuwaIO/siwx/blob/ecff9ffa6386dee5a576efabec2ed72f03dde624/packages/siwx-react/src/sessionStore.ts#L33)

Current authentication status.
