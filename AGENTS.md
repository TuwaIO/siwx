# 🤖 Agent Context: Sign-In With X (`@tuwaio/siwx`)

## 1. Project Philosophy & Goal

- **What is this?** A monorepo for **SIWX (Sign-In With X)** — Low-Level Core & Adapters Layer (L1/L2) of the TUWA Ecosystem. It implements the [CAIP-122](https://github.com/ChainAgnostic/CAIPs/blob/main/CAIPs/caip-122.md) standard for chain-agnostic, multi-chain sign-in messages.
- **Role in TUWA:** L1 (`siwx-core`, pure CAIP-122 engine, zero dependencies) and L2 (`siwx-*` adapters, framework bindings, server utilities). Sits below the Connection & Session Integration Layer (`satellite`, L3) and the UI Layer (`nova-uikit`, L7).
- **Philosophy:** Headless, backend-agnostic, Sovereign Individual. No framework lock-in. No cloud services.

## 2. Tech Stack (Verified)

- **Core:** TypeScript v6.0+, Node.js (v20+), pnpm v11+ (Workspace).
- **Web3 (EVM):** `viem` v2.x, `@wagmi/core` v3.x.
- **Web3 (Solana):** `gill` v0.14+, `@wallet-standard/base`.
- **State Management:** `zustand` v5.x (with `immer` + `persist` middleware).
- **Docs:** Next.js v16, Nextra v4, Tailwind CSS v4.
- **Build:** `tsup` (ESM/CJS/DTS). `typedoc` + `typedoc-plugin-markdown` for API docs.

## 3. Architecture & Directory Structure

```
siwx/
├── apps/
│   └── docs/                    # Documentation site (Next.js 16 + Nextra 4)
│       └── src/content/         # MDX pages + auto-generated apiReference/
├── packages/
│   ├── siwx-core/               # CAIP-122 builder, parser, validator. Zero deps.
│   │   └── src/
│   │       ├── types.ts         # All core types (SiwxMessageFields, SiwxVerifyResult, etc.)
│   │       ├── errors.ts        # Typed error classes (SiwxParseError, etc.)
│   │       ├── buildMessage.ts  # buildMessage() — CAIP-122 formatter
│   │       ├── parseMessage.ts  # parseMessage() — CAIP-122 parser
│   │       ├── validateMessage.ts # validateMessage() + generateNonce()
│   │       └── index.ts         # Public API barrel
│   ├── siwx-evm/                # EVM adapter (eip155). EIP-191 + EIP-1271.
│   │   └── src/
│   │       ├── types.ts         # EVM-specific types
│   │       ├── signer.ts        # createEvmSiwxSigner()
│   │       ├── verify.ts        # verifyEip191() + verifyEip1271()
│   │       └── index.ts
│   ├── siwx-solana/             # Solana adapter. ed25519 via SubtleCrypto.
│   │   └── src/
│   │       ├── types.ts         # Solana-specific types
│   │       ├── signer.ts        # createSolanaSiwxSigner()
│   │       ├── verify.ts        # verifyEd25519()
│   │       └── index.ts
│   ├── siwx-react/              # React hooks + Zustand session store.
│   │   └── src/
│   │       ├── sessionStore.ts  # Zustand store (useSiwxSessionStore)
│   │       ├── hooks.ts         # useSiwx() + useSiwxSession()
│   │       ├── satelliteHelpers.ts # createSatelliteSiwxWatcherOptions()
│   │       └── index.ts
│   └── siwx-server/             # Backend utilities. Backend-agnostic.
│       └── src/
│           ├── types.ts         # SiwxSession, CookieOptions, ServerVerifyResult
│           ├── server.ts        # verifySiwxPayload() + cookie utils
│           ├── next.ts          # createSiwxApiHandler() for Next.js App Router
│           └── index.ts
├── package.json                 # Root workspace config
└── pnpm-workspace.yaml
```

## 4. Coding Standards (STRICT)

- **Language:** English ONLY (Code, Comments, Commits).
- **Style:** Functional programming. Pure functions preferred.
- **Types:** Strict TypeScript. **NO `any`**. Usage of `ts-expect-error` must be justified.
- **Comments:** JSDoc required for **all** exported functions and types.
  - Must explain _inputs_, _outputs_, and _side effects_.
- **Naming:**
  - Files: `camelCase.ts` (utils, hooks, stores), `PascalCase.tsx` (components).
  - Variables/Functions: `camelCase`.
  - Types/Interfaces: `PascalCase`.

## 5. Key Workflows

- **Build:** `pnpm build` (Builds all packages via `tsup`).
- **Test:** `pnpm test` (Runs `vitest` in isolated packages).
- **Lint/Format:** `pnpm lint` / `pnpm format`.
- **Docs:** `pnpm docs:gen` (Generates API docs via TypeDoc).
- **Clean:** `pnpm clean`.

## 6. AI Agent Behavior (Mandatory)

- **Post-Work Routine:** After generating or modifying code, you **MUST** run `pnpm lint --fix` and `pnpm format` to ensure code quality.
- **Dependency Rule:** Never install new packages without explicit user permission.
- **Hallucination Check:**
  - Do **NOT** import `ethers.js` (We use `viem`).
  - Do **NOT** import `@solana/web3.js` legacy methods (We use `gill` and SubtleCrypto).
  - Do **NOT** assume Starknet or Cosmos support exists (v1 is EVM + Solana only).
  - Do **NOT** add UI components to any package except `siwx-react` (and even then, no visual components — only hooks and store).
  - Do **NOT** couple `siwx-server` or any package to Quasar. It is a consumer, not a dependency.
