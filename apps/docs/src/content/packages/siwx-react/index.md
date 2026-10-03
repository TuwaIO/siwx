# @tuwaio/siwx-react

[![NPM Version](https://img.shields.io/npm/v/@tuwaio/siwx-react.svg)](https://www.npmjs.com/package/@tuwaio/siwx-react)
[![License](https://img.shields.io/npm/l/@tuwaio/siwx-react.svg)](https://github.com/TuwaIO/siwx/blob/main/packages/siwx-react/LICENSE)

`@tuwaio/siwx-react` is the React Layer 2 (L2) package of **SIWX** (Sign-In With X), the authentication project of TUWA Stage 1 ("Core Auth & Primitives", next to Orbit Utils). Built on **`@tuwaio/siwx-core`**, **`react`** and **`zustand`** (with the `immer` middleware), it runs the CAIP-122 sign-in flow in React apps with two hooks and a session store. It ships no UI components and makes no network requests of its own: you pass the wallet signer and the calls to your backend.

---

## 🏛️ Core Capabilities

- **Sign-in flow:** `useSiwx().signIn` gets a nonce, builds the CAIP-122 message, asks the wallet to sign it and sends it to your verifier, updating the store at each step (`idle` → `building` → `signing` → `verifying` → `authenticated` or `error`). Failures are reported through the store and `onError`; `signIn` does not reject.
- **Session state:** `useSiwxSession` returns `status`, `session`, `error` and `isAuthenticated`; `useSiwxSessionStore` is the underlying zustand store for selectors and custom flows. The verified session is saved to `localStorage` and restored after a reload (see Browser Storage below).
- **Chain agnostic:** works with any signer, such as `createEvmSiwxSigner` from [`@tuwaio/siwx-evm`](https://siwx.docs.tuwa.io/packages/siwx-evm) or `createSolanaSiwxSigner` from [`@tuwaio/siwx-solana`](https://siwx.docs.tuwa.io/packages/siwx-solana), and with any backend, such as the handlers of [`@tuwaio/siwx-server`](https://siwx.docs.tuwa.io/packages/siwx-server).
- **Satellite Connect helpers:** `getSatelliteSiwxFields`, `createSatelliteSiwxSigner` and `isSessionMatchingConnection` build the message fields and the signer from an active [Satellite Connect](https://satellite.docs.tuwa.io/) connection. They are duck-typed, so this package does not depend on Satellite Connect.

> [!WARNING]
> The store is UI state only. Server code must read the session from the `HttpOnly` cookie issued by your backend (for example with `getSiwxServerSession`) and never trust session data sent by the client.

---

## 💾 Installation

```bash
pnpm add @tuwaio/siwx-react @tuwaio/siwx-core react zustand immer
```

> [!IMPORTANT]
> `@tuwaio/siwx-core`, `react` (>=19.2.3), `zustand` (>=5) and `immer` (>=11) are peer dependencies and must be installed alongside `@tuwaio/siwx-react`. Add `@tuwaio/siwx-evm` and/or `@tuwaio/siwx-solana` for the wallet signers.

---

## 🚀 Usage

### Signing in

The example uses the routes of `createSiwxApiHandler` from `@tuwaio/siwx-server/next`, mounted at `/api/siwx`:

```tsx
import { createEvmSiwxSigner } from '@tuwaio/siwx-evm';
import { useSiwx, useSiwxSession } from '@tuwaio/siwx-react';
import type { WalletClient } from 'viem';

export function SignInButton({ walletClient, address }: { walletClient: WalletClient; address: string }) {
  const { signIn, signOut } = useSiwx();
  const { status, session, error, isAuthenticated } = useSiwxSession();

  const handleSignIn = () =>
    signIn({
      signer: createEvmSiwxSigner(walletClient),
      // The server only accepts nonces it has issued.
      getNonce: async () => {
        const response = await fetch('/api/siwx/nonce');
        const { nonce } = (await response.json()) as { nonce: string };
        return nonce;
      },
      // Returns the session JSON on success, or null.
      verifier: async (payload) => {
        const response = await fetch('/api/siwx/verify', { method: 'POST', body: JSON.stringify(payload) });
        return response.ok ? response.json() : null;
      },
      fields: {
        domain: window.location.host,
        uri: window.location.origin,
        address: `eip155:1:${address}`,
        chainId: 'eip155:1',
        statement: 'Sign in to TUWA.',
      },
    });

  const handleSignOut = async () => {
    await fetch('/api/siwx/session', { method: 'DELETE' }); // revokes the session and clears the cookie
    signOut(); // resets the store
  };

  if (isAuthenticated) return <button onClick={handleSignOut}>Sign out {session?.address}</button>;

  return (
    <button onClick={handleSignIn} disabled={status === 'signing' || status === 'verifying'}>
      {error ? `Retry sign-in (${error})` : 'Sign in'}
    </button>
  );
}
```

- `issuedAt` defaults to now and `expirationTime` to 24 hours later; pass `fields.expirationTime` to match the server policy (for example `maxSessionLifetimeSeconds`).
- Without `getNonce` and `fields.nonce`, the nonce is generated in the browser. Both handlers of `@tuwaio/siwx-server/next` (durable and demo) reject such nonces, so pass `getNonce` with them.

### Syncing with the server session

The saved session is restored after a reload until its `expirationTime`, but the server can end a session earlier (logout in another tab, revoked session, expired cookie). To keep the UI in sync, check the server session when the app starts:

```tsx
import { type SiwxClientSession, useSiwxSessionStore } from '@tuwaio/siwx-react';
import { useEffect } from 'react';

export function useSyncSiwxSession() {
  useEffect(() => {
    void fetch('/api/siwx/session')
      .then((response) => response.json() as Promise<SiwxClientSession | null>)
      .then((session) => {
        if (!session) useSiwxSessionStore.getState().reset(); // also clears the saved session
      });
  }, []);
}
```

### Satellite Connect

```tsx
import {
  createSatelliteSiwxSigner,
  getSatelliteSiwxFields,
  isSessionMatchingConnection,
  type MinimalSatelliteConnection,
  type SiwxClientSession,
  useSiwx,
  useSiwxSession,
} from '@tuwaio/siwx-react';
import { useEffect } from 'react';

declare function getNonce(): Promise<string>;
declare function verifier(payload: { message: string; signature: string }): Promise<SiwxClientSession | null>;

export function SatelliteSignIn({ connection }: { connection: MinimalSatelliteConnection }) {
  const { signIn, signOut } = useSiwx();
  const { session } = useSiwxSession();

  // Sign out when the user switches to another account or chain.
  useEffect(() => {
    if (session && !isSessionMatchingConnection(session, connection)) signOut();
  }, [session, connection, signOut]);

  const handleSignIn = async () =>
    signIn({
      signer: await createSatelliteSiwxSigner(connection),
      fields: getSatelliteSiwxFields(connection, { statement: 'Sign in to TUWA.', expirationSeconds: 60 * 60 }),
      getNonce,
      verifier,
    });

  return <button onClick={handleSignIn}>Sign in</button>;
}
```

`getSatelliteSiwxFields` treats the connection as EVM when its address starts with `0x` or `eip155:`, its chain ID is a number or starts with `eip155:`, or it has a `connector`, and as Solana otherwise. A Solana cluster (`devnet` in a Satellite Connect connection) gets its genesis-hash chain ID, `solana:EtWTRABZaYq6iMfeYKouRu166VU2xqa1`; `isSessionMatchingConnection` still matches sessions signed for `solana:devnet`. `domain` and `uri` default to `window.location.host` and `window.location.href`.

---

## 🗄️ Browser Storage

The store saves the verified session to `localStorage`. Clear the key (or call `useSiwxSessionStore.getState().reset()`) to reset the client state of a user:

| Key                  | Written by            | Content                                                                                                                      |
| -------------------- | --------------------- | ---------------------------------------------------------------------------------------------------------------------------- |
| `siwx-react:session` | `useSiwxSessionStore` | `{ state: { session }, version }`: `address`, `chainId`, `domain`, `issuedAt` and `expirationTime` of the session, or `null` |

- Only an `authenticated` session is saved; `reset` and a failed or new sign-in write `null`.
- The saved session is restored when `useSiwx` or `useSiwxSession` first mounts, after hydration, so server rendering and the first client render are always `idle`. It is not restored once its `expirationTime` has passed. Outside React, call `useSiwxSessionStore.persist.rehydrate()`.
- Nothing is saved until the session has been restored, and nothing is read or written during server rendering or when `localStorage` is unavailable.
- The session cookie itself is set by your backend as an `HttpOnly` cookie that scripts cannot read.

---

## 📚 API Reference

Every export, with signatures and types generated from the source, is documented at **[siwx.docs.tuwa.io/packages/siwx-react](https://siwx.docs.tuwa.io/packages/siwx-react)**.

## 📄 License

Licensed under the **Apache-2.0 License**. See the [LICENSE](https://github.com/TuwaIO/siwx/blob/main/packages/siwx-react/LICENSE) file for details.

## Interfaces

- [MinimalSatelliteConnection](/packages/siwx-react/interfaces/MinimalSatelliteConnection.md)
- [SatelliteSiwxFieldOptions](/packages/siwx-react/interfaces/SatelliteSiwxFieldOptions.md)
- [SiwxClientSession](/packages/siwx-react/interfaces/SiwxClientSession.md)
- [SiwxMessageFields](/packages/siwx-react/interfaces/SiwxMessageFields.md)
- [SiwxSessionActions](/packages/siwx-react/interfaces/SiwxSessionActions.md)
- [SiwxSessionLike](/packages/siwx-react/interfaces/SiwxSessionLike.md)
- [SiwxSessionState](/packages/siwx-react/interfaces/SiwxSessionState.md)
- [UseSiwxReturn](/packages/siwx-react/interfaces/UseSiwxReturn.md)
- [UseSiwxSignInOptions](/packages/siwx-react/interfaces/UseSiwxSignInOptions.md)

## Type Aliases

- [ParsedSiwxMessage](/packages/siwx-react/type-aliases/ParsedSiwxMessage.md)
- [SiwxSessionStore](/packages/siwx-react/type-aliases/SiwxSessionStore.md)
- [SiwxStatus](/packages/siwx-react/type-aliases/SiwxStatus.md)

## Variables

- [useSiwxSessionStore](/packages/siwx-react/variables/useSiwxSessionStore.md)

## Functions

- [createSatelliteSiwxSigner](/packages/siwx-react/functions/createSatelliteSiwxSigner.md)
- [getSatelliteSiwxFields](/packages/siwx-react/functions/getSatelliteSiwxFields.md)
- [isSessionMatchingConnection](/packages/siwx-react/functions/isSessionMatchingConnection.md)
- [isSessionMatchingTarget](/packages/siwx-react/functions/isSessionMatchingTarget.md)
- [useSiwx](/packages/siwx-react/functions/useSiwx.md)
- [useSiwxSession](/packages/siwx-react/functions/useSiwxSession.md)
