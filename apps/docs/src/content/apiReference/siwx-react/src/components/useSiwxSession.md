[**API Reference — @tuwaio/siwx (CAIP-122 Authentication Layer)**](../../../README.md)

***

# useSiwxSession()

> **useSiwxSession**(): `object`

Defined in: [packages/siwx-react/src/hooks.ts:186](https://github.com/TuwaIO/siwx/blob/167aa43449a41570492d730acd27b9779827d2e5/packages/siwx-react/src/hooks.ts#L186)

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
