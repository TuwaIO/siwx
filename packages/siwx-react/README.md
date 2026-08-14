# `@tuwaio/siwx-react`

[![NPM Version](https://img.shields.io/npm/v/@tuwaio/siwx-react.svg)](https://www.npmjs.com/package/@tuwaio/siwx-react)
[![License](https://img.shields.io/npm/l/@tuwaio/siwx-react.svg)](./LICENSE)

> React bindings for `@tuwaio/siwx` (L2). Provides a Zustand-powered session store and hooks for managing the full CAIP-122 authentication lifecycle — completely independent of any backend SDK.

---

## 🏛️ Core Capabilities

- **Session State Management**: A `zustand` store (with `immer` + `persist` via `sessionStorage`) tracks the client-side authentication lifecycle: `idle → building → signing → verifying → authenticated | error`.
- **`useSiwx()` Hook**: Orchestrates the sign-in flow: requests challenge nonce → builds CAIP-122 message → triggers wallet signer → verifies with backend → sets verified session.
- **`useSiwxSession()` Hook**: Lightweight selector for reading the current authentication state and active account details in any component.
- **Satellite Helpers**: Duck-typed integration helpers for `@tuwaio/satellite-core` connections.
- **Backend Agnostic**: Works with any EVM or Solana signer (`wagmi`, `viem`, `gill`, Wallet Standard) and any backend endpoint.

> **Important**: Client-side session state in Zustand reflects UI parity only. Server actions and API routes must never trust client-provided session state as proof of identity and must always verify the server-issued `HttpOnly` session cookie or authorization token.

---

## 💾 Installation

```bash
pnpm add @tuwaio/siwx-react @tuwaio/siwx-core zustand immer
```

---

## 🚀 API & Usage Examples

### 1. `useSiwx()` Hook

Orchestrates wallet signing and backend verification.

```tsx
import { useSiwx } from '@tuwaio/siwx-react';
import { createEvmSiwxSigner } from '@tuwaio/siwx-evm';

function LoginButton({ walletClient, address }: { walletClient: any; address: string }) {
  const { signIn, signOut } = useSiwx();

  const handleLogin = async () => {
    await signIn({
      // 1. Chain-specific signer adapter
      signer: createEvmSiwxSigner(walletClient),

      // 2. Backend verifier calling your Next.js route handler
      verifier: async (payload) => {
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
  };

  return <button onClick={handleLogin}>Sign In</button>;
}
```

### 2. `useSiwxSession()` Hook

Reads the authenticated user session in React components.

```tsx
import { useSiwxSession } from '@tuwaio/siwx-react';

function UserProfile() {
  const { isAuthenticated, session, status, error } = useSiwxSession();

  if (status === 'signing' || status === 'verifying') {
    return <span>Authenticating...</span>;
  }

  if (!isAuthenticated || !session) {
    return <span>Not signed in</span>;
  }

  return (
    <div>
      <p>Address: {session.address}</p>
      <p>Chain ID: {session.chainId}</p>
    </div>
  );
}
```

### 3. `useSiwxSessionStore`

Direct store access for subscribing to specific state slices.

```ts
import { useSiwxSessionStore } from '@tuwaio/siwx-react';

// Subscribe to address slice
const address = useSiwxSessionStore((s) => s.session?.address);
```

---

## 🛰️ Satellite Connection Helpers

Integration helpers for applications using `@tuwaio/satellite-core`.

### `getSatelliteSiwxFields(activeConnection, options?)`

Extracts normalized CAIP-10 and CAIP-2 identifiers directly from the active connection.

```ts
import { getSatelliteSiwxFields } from '@tuwaio/siwx-react';

const fields = getSatelliteSiwxFields(activeConnection, {
  statement: 'Sign in to TUWA.',
});
```

### `createSatelliteSiwxSigner(activeConnection)`

Returns the standardized message signer callback from the active connection.

```ts
import { createSatelliteSiwxSigner } from '@tuwaio/siwx-react';

const signer = await createSatelliteSiwxSigner(activeConnection);
```

### `isSessionMatchingConnection(session, activeConnection)`

Evaluates whether the active SIWX session matches the current wallet connection.

```ts
import { isSessionMatchingConnection } from '@tuwaio/siwx-react';

const isMatching = isSessionMatchingConnection(session, activeConnection);
```

---

## 🔄 Session Lifecycle

```
idle
 └─ signIn() called
     └─ building    (requesting challenge nonce & assembling fields)
         └─ signing     (wallet signing prompt)
             └─ verifying   (backend verification)
                 ├─ authenticated ✅ (session persisted to sessionStorage)
                 └─ error ❌ (error message recorded)
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
