# @tuwaio/siwx-evm

[![NPM Version](https://img.shields.io/npm/v/@tuwaio/siwx-evm.svg)](https://www.npmjs.com/package/@tuwaio/siwx-evm)
[![License](https://img.shields.io/npm/l/@tuwaio/siwx-evm.svg)](https://github.com/TuwaIO/siwx/blob/main/packages/siwx-evm/LICENSE)

`@tuwaio/siwx-evm` is the EVM Layer 2 (L2) package of **SIWX** (Sign-In With X), the authentication project of TUWA Stage 1 ("Core Auth & Primitives", next to Orbit Utils). Built on **`@tuwaio/siwx-core`**, **`viem`** and **`@wagmi/core`**, it signs CAIP-122 messages with EVM wallets and verifies `eip155` signatures: EIP-191 for EOA wallets, EIP-1271 for deployed smart contract wallets and ERC-6492 for smart contract wallets that are not deployed yet. It does not use `ethers.js` or `web3.js`.

---

## 🏛️ Core Capabilities

- **Signing:** `createEvmSiwxSigner` turns a wagmi `Config` or a viem `WalletClient` into the `(message) => signature` function that `useSiwx` from [`@tuwaio/siwx-react`](https://siwx.docs.tuwa.io/packages/siwx-react) expects.
- **EOA verification:** `verifyEip191` recovers the signer of a `personal_sign` signature and compares it with the message address. It runs locally, without RPC calls.
- **Smart contract wallets:** `verifyEip1271` checks Safe, Coinbase Smart Wallet / Base Account and other ERC-4337 accounts with viem's `verifyMessage`: `isValidSignature` (EIP-1271) of a deployed account, or the ERC-6492 wrapper of an account that is not deployed yet, in one `eth_call`.
- **Every chain:** `publicClient` is one viem `PublicClient`, used only for messages of its own chain, or a function that returns the client of a chain number. A contract wallet is always checked on the chain it signed for.
- **Combined check:** `verifyEvmSignature` tries EIP-191 first and falls back to the contract wallet check when there is a client for the message chain; `result.method` (`eip191`, `eip1271` or `erc6492`) tells which one succeeded.
- **No throwing:** every verifier parses the message, requires an `eip155` chain, checks the format, expiration and `notBefore` with `validateMessage`, and returns `{ success, data, error }`.

---

## 💾 Installation

```bash
pnpm add @tuwaio/siwx-evm @tuwaio/siwx-core @tuwaio/orbit-core @wagmi/core viem
```

> [!IMPORTANT]
> `@tuwaio/siwx-core`, `viem` (>=2) and `@wagmi/core` (>=3) are peer dependencies and must be installed alongside `@tuwaio/siwx-evm`. `@wagmi/core` is needed even if you only sign with a viem `WalletClient`.

---

## 🚀 Usage

### Signing with wagmi or viem

```typescript
import { createEvmSiwxSigner } from '@tuwaio/siwx-evm';
import type { Config } from '@wagmi/core';
import type { WalletClient } from 'viem';

declare const wagmiConfig: Config;
declare const walletClient: WalletClient;
declare const message: string;

// wagmi: signs with the connected account.
const signer = createEvmSiwxSigner(wagmiConfig);

// viem: signs with the client account, or with an explicit account.
const viemSigner = createEvmSiwxSigner(walletClient, '0xAb5801a7D398351b8bE11C439e05C5B3259aeC9B');

// Opens the wallet prompt. Rejects with "[SIWX-EVM] Signing failed: …" (original error in `cause`).
const signature = await signer(message);
```

### Verifying a signature

```typescript
import { type EvmVerifyClient, verifyEvmSignature } from '@tuwaio/siwx-evm';
import { createPublicClient, http } from 'viem';
import { base, mainnet } from 'viem/chains';

declare const message: string;
declare const signature: `0x${string}`;

// Needed only for smart contract wallets: one client per chain your users sign in on
const clients = new Map<number, EvmVerifyClient>(
  [mainnet, base].map((chain) => [chain.id, createPublicClient({ chain, transport: http() })]),
);

const result = await verifyEvmSignature(message, signature, { publicClient: (chainId) => clients.get(chainId) });

if (result.success) {
  console.log(result.method, result.data?.address); // "eip191", "eip1271" or "erc6492", "eip155:8453:0x…"
} else {
  console.error(result.error);
}
```

- Use `verifyEip191` alone when you only accept EOA wallets, and `verifyEip1271` when you know the account is a contract.
- EOA wallets need no client on any chain. A smart contract wallet that signs on a chain without a client fails verification; a single client of another chain is never used, because the same account address can have other owners there.
- The verifiers do not check the domain, URI, nonce or other policy rules. On a server, use [`@tuwaio/siwx-server`](https://siwx.docs.tuwa.io/packages/siwx-server), which adds the policy and single-use nonces, or run `validatePolicy` from `@tuwaio/siwx-core` yourself.
- `skipExpiration: true` disables the expiration check. Keep it off in production.

---

## 🌐 External Services

The package contacts no hosts of its own. `verifyEip1271`, and `verifyEvmSignature` when it falls back to the contract wallet check, send one `eth_call` to the RPC endpoint of the client of the message chain (with viem's `http()` and no URL, that is the default public RPC of the chain). Signing goes through the wallet of the wagmi `Config` or `WalletClient`.

---

## 📚 API Reference

Every export, with signatures and types generated from the source, is documented at **[siwx.docs.tuwa.io/packages/siwx-evm](https://siwx.docs.tuwa.io/packages/siwx-evm)**.

## 📄 License

Licensed under the **Apache-2.0 License**. See the [LICENSE](https://github.com/TuwaIO/siwx/blob/main/packages/siwx-evm/LICENSE) file for details.
