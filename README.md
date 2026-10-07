# SIWX — Sign-In With X

[![License](https://img.shields.io/npm/l/@tuwaio/siwx-core.svg)](./LICENSE)
[![Build Status](https://img.shields.io/github/actions/workflow/status/TuwaIO/siwx/release.yml?branch=main)](https://github.com/TuwaIO/siwx/actions)

<p align="center">
  <img src="https://raw.githubusercontent.com/TuwaIO/workflows/refs/heads/main/preview/repos/siwx.png" alt="SIWX" width="450" style="border-radius: 12px; margin: 24px auto;" />
</p>

**SIWX** (Sign-In With X) is the authentication project of TUWA Stage 1: headless, framework-agnostic sign-in for EVM and Solana accounts, built on the [CAIP-122](https://github.com/ChainAgnostic/CAIPs/blob/main/CAIPs/caip-122.md) standard. It builds and signs chain-agnostic sign-in messages, verifies them on your backend with single-use nonces and cookie sessions, and tracks the sign-in state in React, with no UI components and no hosted services.

SIWX is built only on modern Web3 libraries: `viem` and `@wagmi/core` for EVM, `@solana/kit` and the Web Crypto API for Solana. It does not use `ethers.js`, `web3.js`, `@solana/web3.js` or `gill`, and it does not depend on any authentication platform or Wallet-as-a-Service.

📖 **Documentation:** [siwx.docs.tuwa.io](https://siwx.docs.tuwa.io)

---

## 🏛️ Ecosystem Layer Architecture

TUWA is built in stages. SIWX sits in **Stage 1 (Core Auth & Primitives)** next to [Orbit Utils](https://orbit.docs.tuwa.io/), below [Satellite Connect](https://satellite.docs.tuwa.io/) and [Pulsar](https://pulsar.docs.tuwa.io/) (Stage 2), [Quasar](https://docs.tuwa.io/quasar) (Stage 3) and [Nova UI Kit](https://stories.tuwa.io/) (Stage 4). Higher layers such as Satellite Connect and the TUWA SDK use SIWX. SIWX reads chain and account IDs (CAIP-2, CAIP-10, Solana genesis-hash chain IDs) with `@tuwaio/orbit-core` of Orbit Utils, a package without dependencies of its own, and depends on nothing else in TUWA, so it can be used on its own.

Inside the monorepo, packages are split into two layers:

### Layer 1: Foundational Core (L1)

- **[`@tuwaio/siwx-core`](./packages/siwx-core)**: the CAIP-122 message format (build, parse, validate), verification policies, session matching, nonces, typed errors and the shared types. Its only dependency is the peer `@tuwaio/orbit-core`.

### Layer 2: Chains, React and Server (L2)

- **[`@tuwaio/siwx-evm`](./packages/siwx-evm)**: EVM signer and verifiers: EIP-191 for EOA wallets, EIP-1271 and ERC-6492 for smart contract wallets, deployed or not, on the chain they signed for. Peer dependencies: `viem`, `@wagmi/core`.
- **[`@tuwaio/siwx-solana`](./packages/siwx-solana)**: Solana signer and ed25519 verifier (Web Crypto). Peer dependencies: `@solana/kit`, `@wallet-standard/base`.
- **[`@tuwaio/siwx-react`](./packages/siwx-react)**: `useSiwx` and `useSiwxSession` hooks, a zustand session store persisted to `localStorage`, and Satellite Connect helpers. Peer dependencies: `react`, `zustand`, `immer`.
- **[`@tuwaio/siwx-server`](./packages/siwx-server)**: server-side verification, nonce and session stores, cookie helpers, Next.js App Router handlers (`@tuwaio/siwx-server/next`) and JWT/JWKS for external auth providers. Optional peer dependencies: `@tuwaio/siwx-evm`, `@tuwaio/siwx-solana`, `viem`.

All L2 packages have `@tuwaio/siwx-core` and `@tuwaio/orbit-core` as peer dependencies.

---

## 🔧 Monorepo Structure

```
siwx/
├── apps/
│   └── docs/                   # siwx.docs.tuwa.io (Next.js 16 + Nextra 4)
│       ├── src/content/        # Hand-written MDX pages + generated `packages/` reference
│       └── typedoc/            # TypeDoc plugins, Packages overview page and sidebar template
├── packages/
│   ├── siwx-core/              # L1: CAIP-122 message format, validation, policies, errors, types
│   ├── siwx-evm/               # L2: EVM signer, EIP-191, EIP-1271 and ERC-6492 verification (viem, @wagmi/core)
│   ├── siwx-solana/            # L2: Solana signer, ed25519 verification (@solana/kit, Web Crypto)
│   ├── siwx-react/             # L2: React hooks and zustand session store
│   └── siwx-server/            # L2: server verification, nonce/session stores, cookies, Next.js handlers, JWT/JWKS
└── typedoc.json                # Reference generation (TypeDoc "packages" strategy)
```

---

## 💾 Installation

Install the L1 core and the L2 packages your app needs:

```bash
# L1 Core
pnpm add @tuwaio/siwx-core @tuwaio/orbit-core

# L2 EVM
pnpm add @tuwaio/siwx-evm @tuwaio/siwx-core @tuwaio/orbit-core @wagmi/core viem

# L2 Solana
pnpm add @tuwaio/siwx-solana @tuwaio/siwx-core @tuwaio/orbit-core @solana/kit @wallet-standard/base

# L2 React
pnpm add @tuwaio/siwx-react @tuwaio/siwx-core @tuwaio/orbit-core react zustand immer

# L2 Server (plus the chain packages of the chains you accept)
pnpm add @tuwaio/siwx-server @tuwaio/siwx-core @tuwaio/orbit-core
```

---

## 🚀 Architectural Usage Example

A Next.js app that signs in EVM wallets. The server issues nonces, verifies the signed message and sets an `HttpOnly` session cookie; the client builds and signs the message:

```typescript
// app/api/siwx/[...siwx]/route.ts
import { createSiwxApiHandler } from '@tuwaio/siwx-server/next';

import { nonceStore, sessionStore } from '@/lib/authStores'; // your SiwxNonceStore and SiwxSessionStore (e.g. Redis)

export const { GET, POST, DELETE } = createSiwxApiHandler({
  sessionStore,
  nonceStore,
  policy: { expectedDomain: 'app.tuwa.io', requireExpirationTime: true, maxIssuedAtAgeSeconds: 300 },
});
```

```tsx
// components/SignInButton.tsx
import { createEvmSiwxSigner } from '@tuwaio/siwx-evm';
import { useSiwx, useSiwxSession } from '@tuwaio/siwx-react';
import type { Config } from '@wagmi/core';

export function SignInButton({ wagmiConfig, address }: { wagmiConfig: Config; address: string }) {
  const { signIn } = useSiwx();
  const { isAuthenticated, session } = useSiwxSession();

  const handleSignIn = () =>
    signIn({
      signer: createEvmSiwxSigner(wagmiConfig),
      getNonce: async () => ((await (await fetch('/api/siwx/nonce')).json()) as { nonce: string }).nonce,
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

  return isAuthenticated ? <span>{session?.address}</span> : <button onClick={handleSignIn}>Sign in</button>;
}
```

On the server, read the session with `getSiwxServerSession` from `@tuwaio/siwx-server`. For Solana, use `createSolanaSiwxSigner` from `@tuwaio/siwx-solana` and a `solana:` address and chain ID; the same route verifies both.

---

## 🛠️ Development

```bash
pnpm install                         # installs dependencies and builds all packages
pnpm build                           # builds packages with tsup (ESM, CJS, types)
pnpm test                            # runs vitest in every package
pnpm lint                            # runs ESLint
pnpm docs:gen                        # regenerates the Packages reference in apps/docs
pnpm --filter @tuwaio/siwx-docs dev  # runs the docs site locally
```

The Packages reference is generated from each package's entry points (`src/index.ts`, plus `src/next.ts` for `siwx-server`), JSDoc and README, and is regenerated by the pre-commit hook. Source links point to `main`, so a regeneration only changes the pages whose source actually changed.

---

## 🤝 Contribution & Auditing

Please review our ecosystem **[Contribution Guidelines](https://github.com/TuwaIO/workflows/blob/main/CONTRIBUTING.md)**.

## 📄 License

Licensed under the **Apache-2.0 License**. See the [LICENSE](./LICENSE) file for details.
