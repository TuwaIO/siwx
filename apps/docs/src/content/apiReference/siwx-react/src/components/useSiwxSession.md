[**API Reference — @tuwaio/siwx (CAIP-122 Authentication Layer)**](../../../README.md)

***

# useSiwxSession()

> **useSiwxSession**(): `object`

Defined in: [packages/siwx-react/src/hooks.ts:155](https://github.com/TuwaIO/siwx/blob/8e4b42d7efd91d50100ad87a03ed6922bb680d68/packages/siwx-react/src/hooks.ts#L155)

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

> **status**: `SiwxStatus`

## Example

```tsx
const { status, session, error } = useSiwxSession();
if (status === 'authenticated') {
  console.log('Signed in as:', session?.address);
}
```
