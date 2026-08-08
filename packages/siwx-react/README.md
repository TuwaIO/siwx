# `@tuwaio/siwx-react`

[![NPM Version](https://img.shields.io/npm/v/@tuwaio/siwx-react.svg)](https://www.npmjs.com/package/@tuwaio/siwx-react)
[![License](https://img.shields.io/npm/l/@tuwaio/siwx-react.svg)](./LICENSE)

> React bindings for `@tuwaio/siwx` (L2). Provides a Zustand-powered session store and hooks for managing the full CAIP-122 authentication lifecycle — completely independent of any backend SDK.

---

## 🏛️ Core Capabilities

- **Session State Management**: A `zustand` store (with `immer` + `persist` via `sessionStorage`) tracks the complete authentication lifecycle: `idle → signing → verifying → authenticated | error`.
- **`useSiwx()` hook**: Orchestrates the full sign-in flow: build CAIP-122 message → call your signer → call your verifier → store the session.
- **`useSiwxSession()` hook**: A lightweight selector for reading the current auth state in any component.
- **Backend-agnostic**: Works with any signer (wagmi, Wallet Standard) and any verifier.

---

## 💾 Installation

```bash
pnpm add @tuwaio/siwx-react @tuwaio/siwx-core zustand immer
```

---

## 🚀 API & Module Architecture

### `useSiwx()`

Provides `signIn` and `signOut` actions.

```tsx
import { useSiwx } from '@tuwaio/siwx-react';
import { createEvmSiwxSigner } from '@tuwaio/siwx-evm';

function LoginButton({ address }: { address: string }) {
  const { signIn, signOut } = useSiwx();

  const handleLogin = () =>
    signIn({
      // 1. Your wallet signing function (using the standard adapter)
      signer: createEvmSiwxSigner(walletClient),
      // 2. Your backend verifier (returns session or null)
      verifier: async (payload) => {
        // You can easily create this endpoint using @tuwaio/siwx-server/next
        const res = await fetch('/api/siwx/verify', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
        return res.ok ? res.json() : null;
      },
      // 3. CAIP-122 message fields
      fields: {
        domain: window.location.host,
        address: `eip155:1:${address}`,
        uri: window.location.origin,
        chainId: 'eip155:1',
        statement: 'Sign in to TUWA.',
      },
    });

  return <button onClick={handleLogin}>Sign In</button>;
}
```

### `useSiwxSession()`

Reads the current session state.

```tsx
import { useSiwxSession } from '@tuwaio/siwx-react';

function UserAvatar() {
  const { isAuthenticated, session, status, error } = useSiwxSession();

  if (!isAuthenticated) return null;
  return <span>{session?.address}</span>;
}
```

### `useSiwxSessionStore`

Direct Zustand store access for advanced use cases.

```ts
import { useSiwxSessionStore } from '@tuwaio/siwx-react';

// Subscribe to specific slice
const address = useSiwxSessionStore((s) => s.session?.address);
```

---

### Satellite Connection Helpers

`@tuwaio/siwx-react` includes duck-typed integration helpers for `@tuwaio/satellite-core` connections without adding hard dependencies.

#### `getSatelliteSiwxFields(activeConnection, options?)`

Generates exact CAIP-10 and CAIP-2 identifiers strictly from the active connection.

```ts
import { getSatelliteSiwxFields } from '@tuwaio/siwx-react';

const fields = getSatelliteSiwxFields(activeConnection, {
  statement: 'Sign in to TUWA.',
});
// Returns { domain, uri, statement, address: 'eip155:1:0x...', chainId: 'eip155:1' }
```

#### `createSatelliteSiwxSigner(activeConnection)`

Returns the native `signMessage` callback from a Satellite active connection.

```ts
import { createSatelliteSiwxSigner } from '@tuwaio/siwx-react';

const signer = await createSatelliteSiwxSigner(activeConnection);
```

#### `isSessionMatchingConnection(session, activeConnection)`

Evaluates whether an active SIWX session matches an active Satellite connection (handles CAIP-10 address alignment and chainId matching).

```ts
import { isSessionMatchingConnection } from '@tuwaio/siwx-react';

const isMatching = isSessionMatchingConnection(session, activeConnection);
```

#### `isSessionMatchingTarget(session, targetAddress, targetChainId?)`

Re-exported from `@tuwaio/siwx-core` for convenience. Validates whether a SIWX session matches a target wallet address and optional chainId.

```ts
import { isSessionMatchingTarget } from '@tuwaio/siwx-react';

const isValid = isSessionMatchingTarget(session, address, chainId);
```

---

## Session Lifecycle

```
idle
 └─ signIn() called
     └─ signing     (wallet prompt shown)
         └─ verifying (payload sent to backend)
             ├─ authenticated ✅ (session stored in sessionStorage)
             └─ error ❌ (error message stored)
```

---

## Peer Dependencies

| Package             | Version                |
| ------------------- | ---------------------- |
| `@tuwaio/siwx-core` | `workspace:*`          |
| `react`             | `^19.0.0`              |
| `zustand`           | `^5.0.0`               |
| `immer`             | `^10.0.0 \|\| ^11.0.0` |

---

## 📄 License

Licensed under the **Apache-2.0 License**. See the [LICENSE](./LICENSE) file for details.
