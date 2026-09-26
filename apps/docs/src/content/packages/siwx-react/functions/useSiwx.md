# useSiwx()

> **useSiwx**(): [`UseSiwxReturn`](/packages/siwx-react/interfaces/UseSiwxReturn.md)

Defined in: [siwx-react/src/hooks.ts:117](https://github.com/TuwaIO/siwx/blob/main/packages/siwx-react/src/hooks.ts#L117)

React hook that runs the CAIP-122 sign-in flow and keeps its state in [useSiwxSessionStore](/packages/siwx-react/variables/useSiwxSessionStore.md).

`signIn` sets the store to `building`, resolves the nonce and builds the message with `buildMessage` from
`@tuwaio/siwx-core`, sets `signing` and asks `signer` for the signature, then sets `verifying` and passes
`{ message, signature }` to `verifier`. On success it sets `authenticated` with the returned session (which is
saved to `localStorage`) and calls `onSuccess`; on failure it sets `error` and calls `onError`. The hook performs
no network requests itself; your `getNonce` and `verifier` do.

Side effect: after the first mount, restores the session saved by a previous page load (see
[useSiwxSessionStore](/packages/siwx-react/variables/useSiwxSessionStore.md)).

## Returns

[`UseSiwxReturn`](/packages/siwx-react/interfaces/UseSiwxReturn.md)

The `signIn` and `signOut` actions.

## Example

```tsx
const { signIn, signOut } = useSiwx();

const handleLogin = () =>
  signIn({
    signer: createEvmSiwxSigner(walletClient),
    getNonce: async () => (await (await fetch('/api/siwx/nonce')).json()).nonce,
    verifier: async (payload) => {
      const res = await fetch('/api/siwx/verify', { method: 'POST', body: JSON.stringify(payload) });
      return res.ok ? res.json() : null;
    },
    fields: {
      domain: window.location.host,
      address: `eip155:1:${address}`,
      uri: window.location.origin,
      chainId: 'eip155:1',
      statement: 'Sign in to TUWA.',
    },
  });
```
