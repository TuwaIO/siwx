[**API Reference — @tuwaio/siwx (CAIP-122 Authentication Layer)**](../../../README.md)

***

# useSiwxSession()

> **useSiwxSession**(): `object`

Defined in: [packages/siwx-react/src/hooks.ts:194](https://github.com/TuwaIO/siwx/blob/7a4dd6dae3d09a536e9c8ec7c5ea5bf16941b2e9/packages/siwx-react/src/hooks.ts#L194)

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
