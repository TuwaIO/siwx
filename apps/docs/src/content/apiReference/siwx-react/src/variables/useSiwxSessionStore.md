[**API Reference — @tuwaio/siwx (CAIP-122 Authentication Layer)**](../../../README.md)

***

# useSiwxSessionStore

> `const` **useSiwxSessionStore**: `UseBoundStore`\<`WithImmer`\<`WithPersist`\<`StoreApi`\<[`SiwxSessionStore`](../type-aliases/SiwxSessionStore.md)\>, `unknown`\>\>\>

Defined in: [packages/siwx-react/src/sessionStore.ts:94](https://github.com/TuwaIO/siwx/blob/167aa43449a41570492d730acd27b9779827d2e5/packages/siwx-react/src/sessionStore.ts#L94)

The primary Zustand store for SIWX session management.
Uses `persist` middleware to survive page reloads (sessionStorage by default),
and `immer` middleware for clean immutable updates.

## Remarks

This store is completely independent of any backend SDK.
It tracks the client-side authentication state only.
Session validity against a backend is the responsibility of individual hooks.
