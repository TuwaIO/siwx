[**API Reference — @tuwaio/siwx (CAIP-122 Authentication Layer)**](../../../README.md)

***

# useSiwx()

> **useSiwx**(): [`UseSiwxReturn`](../interfaces/UseSiwxReturn.md)

Defined in: [packages/siwx-react/src/hooks.ts:85](https://github.com/TuwaIO/siwx/blob/83e0c9855663c2d6978ceb9e5f570cbbfb6bb802/packages/siwx-react/src/hooks.ts#L85)

The primary hook for triggering the full CAIP-122 Sign-In With X flow.
Orchestrates: message building → wallet signing → backend verification → session storage.

## Returns

[`UseSiwxReturn`](../interfaces/UseSiwxReturn.md)

`signIn` and `signOut` actions.

## Example

```tsx
const { signIn, signOut } = useSiwx();

const handleLogin = () =>
  signIn({
    signer: (msg) => walletClient.signMessage({ message: msg }),
    verifier: async (payload) => {
      const res = await fetch('/api/auth/verify', {
        method: 'POST',
        body: JSON.stringify(payload),
      });
      return res.ok ? res.json() : null;
    },
    fields: {
      domain: 'app.tuwa.io',
      address: `eip155:1:${address}`,
      uri: 'https://app.tuwa.io',
      chainId: 'eip155:1',
      statement: 'Sign in to TUWA.',
    },
  });
```
