# useSiwxSession()

> **useSiwxSession**(): `object`

Defined in: [siwx-react/src/hooks.ts:210](https://github.com/TuwaIO/siwx/blob/main/packages/siwx-react/src/hooks.ts#L210)

React hook that reads the sign-in state from [useSiwxSessionStore](/packages/siwx-react/variables/useSiwxSessionStore.md). The component re-renders when `status`,
`session` or `error` change.

Side effect: after the first mount, restores the session saved by a previous page load, so the first render
(including server rendering) is always `idle`.

## Returns

`status`, `session` and `error`, plus `isAuthenticated` (`true` when `status` is `authenticated` and a
session is set).

### error

> **error**: `string` \| `null`

The last error message, or `null`.

### isAuthenticated

> **isAuthenticated**: `boolean`

`true` when `status` is `authenticated` and `session` is set.

### session

> **session**: [`SiwxClientSession`](/packages/siwx-react/interfaces/SiwxClientSession.md) \| `null`

The verified session, or `null`.

### status

> **status**: [`SiwxStatus`](/packages/siwx-react/type-aliases/SiwxStatus.md)

Current sign-in status.

## Example

```tsx
const { status, session, error } = useSiwxSession();
if (status === 'authenticated') {
  console.log('Signed in as:', session?.address);
}
```
