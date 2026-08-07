[**API Reference — @tuwaio/siwx (CAIP-122 Authentication Layer)**](../../../README.md)

***

# useSiwx()

> **useSiwx**(): [`UseSiwxReturn`](../interfaces/UseSiwxReturn.md)

Defined in: [packages/siwx-react/src/hooks.ts:88](https://github.com/TuwaIO/siwx/blob/21578d633a347019ae3f513dd601d57e4fa60138/packages/siwx-react/src/hooks.ts#L88)

The primary hook for triggering the full CAIP-122 Sign-In With X flow.
Orchestrates: message building → wallet signing → backend verification → session storage.

## Returns

[`UseSiwxReturn`](../interfaces/UseSiwxReturn.md)

`signIn` and `signOut` actions.

## Example

```tsx
import { useSiwx } from '@tuwaio/siwx-react';
import { createEvmSiwxSigner } from '@tuwaio/siwx-evm';

const { signIn, signOut } = useSiwx();

const handleLogin = () =>
  signIn({
    signer: createEvmSiwxSigner(walletClient),
    verifier: async (payload) => {
      const res = await fetch('/api/siwx/verify', {
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
