# useSiwxSessionStore

> `const` **useSiwxSessionStore**: `UseBoundStore`\<`WithImmer`\<`WithPersist`\<`StoreApi`\<[`SiwxSessionStore`](/packages/siwx-react/type-aliases/SiwxSessionStore.md)\>, \{ `session`: [`SiwxClientSession`](/packages/siwx-react/interfaces/SiwxClientSession.md) \| `null`; \}\>\>\>

Defined in: [siwx-react/src/sessionStore.ts:160](https://github.com/TuwaIO/siwx/blob/main/packages/siwx-react/src/sessionStore.ts#L160)

Zustand store (with the `immer` and `persist` middlewares) that holds the client-side SIWX sign-in state. Use it
as a hook, optionally with a selector: `useSiwxSessionStore((state) => state.session)`.

## Remarks

The authenticated session is saved to `localStorage` under the key `siwx-react:session` and cleared by `reset`.
It is restored after a page reload when [useSiwx](/packages/siwx-react/functions/useSiwx.md) or [useSiwxSession](/packages/siwx-react/functions/useSiwxSession.md) first mounts (not during
server rendering, so there is no hydration mismatch), unless its `expirationTime` has passed; outside React call
`useSiwxSessionStore.persist.rehydrate()`. Only the session is saved, never the status of a sign-in in progress.

The store is a module-level singleton shared by every component, and it is UI state only: servers must verify
the session cookie, never trust this store.
