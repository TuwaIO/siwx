[**API Reference — @tuwaio/siwx (CAIP-122 Authentication Layer)**](../../../README.md)

***

# useSiwxSessionStore

> `const` **useSiwxSessionStore**: `UseBoundStore`\<`WithImmer`\<`StoreApi`\<[`SiwxSessionStore`](../type-aliases/SiwxSessionStore.md)\>\>\>

Defined in: [packages/siwx-react/src/sessionStore.ts:93](https://github.com/TuwaIO/siwx/blob/bac8be290114bb4720f42e8f92d70040e76d06fe/packages/siwx-react/src/sessionStore.ts#L93)

The primary Zustand store for SIWX session management.
Uses `persist` middleware to survive page reloads (sessionStorage by default),
and `immer` middleware for clean immutable updates.

## Remarks

This store is completely independent of any backend SDK.
It tracks the client-side authentication state only.
Session validity against a backend is the responsibility of individual hooks.
