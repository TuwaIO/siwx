[**API Reference — @tuwaio/siwx (CAIP-122 Authentication Layer)**](../../../README.md)

***

# useSiwxSession()

> **useSiwxSession**(): `object`

Defined in: [packages/siwx-react/src/hooks.ts:186](https://github.com/TuwaIO/siwx/blob/226309e8a8af6d2fb968b23cea6b3dc7f2a3300b/packages/siwx-react/src/hooks.ts#L186)

A selector hook that returns the current SIWX session state.
Provides the current status, active session, and any error.

## Returns

`object`

The current session state from the Zustand store.

### error

> **error**: `string` \| `null`

### isAuthenticated

> **isAuthenticated**: `boolean`

### session

> **session**: [`SiwxClientSession`](../interfaces/SiwxClientSession.md) \| `null`

### status

> **status**: [`SiwxStatus`](../type-aliases/SiwxStatus.md)

## Example

```tsx
const { status, session, error } = useSiwxSession();
if (status === 'authenticated') {
  console.log('Signed in as:', session?.address);
}
```
