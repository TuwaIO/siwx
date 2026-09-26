# @tuwaio/siwx-evm

[![NPM Version](https://img.shields.io/npm/v/@tuwaio/siwx-evm.svg)](https://www.npmjs.com/package/@tuwaio/siwx-evm)
[![License](https://img.shields.io/npm/l/@tuwaio/siwx-evm.svg)](https://github.com/TuwaIO/siwx/blob/main/packages/siwx-evm/LICENSE)

`@tuwaio/siwx-evm` is the EVM Layer 2 (L2) package of **SIWX** (Sign-In With X), the authentication project of TUWA Stage 1 ("Core Auth & Primitives", next to Orbit Utils). Built on **`@tuwaio/siwx-core`**, **`viem`** and **`@wagmi/core`**, it signs CAIP-122 messages with EVM wallets and verifies `eip155` signatures: EIP-191 for EOA wallets and EIP-1271 for smart contract wallets. It does not use `ethers.js` or `web3.js`.

---

## 🏛️ Core Capabilities

- **Signing:** `createEvmSiwxSigner` turns a wagmi `Config` or a viem `WalletClient` into the `(message) => signature` function that `useSiwx` from [`@tuwaio/siwx-react`](https://siwx.docs.tuwa.io/packages/siwx-react) expects.
- **EOA verification:** `verifyEip191` recovers the signer of a `personal_sign` signature and compares it with the message address. It runs locally, without RPC calls.
- **Smart contract wallets:** `verifyEip1271` calls `isValidSignature` on the account contract (for example a Safe) through a viem `PublicClient`.
- **Combined check:** `verifyEvmSignature` tries EIP-191 first and falls back to EIP-1271 when a `publicClient` is passed; `result.method` tells which one succeeded.
- **No throwing:** every verifier parses the message, requires an `eip155` chain, checks the format, expiration and `notBefore` with `validateMessage`, and returns `{ success, data, error }`.

---

## 💾 Installation

```bash
pnpm add @tuwaio/siwx-evm @tuwaio/siwx-core @wagmi/core viem
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
import { verifyEvmSignature } from '@tuwaio/siwx-evm';
import { createPublicClient, http } from 'viem';
import { mainnet } from 'viem/chains';

declare const message: string;
declare const signature: `0x${string}`;

// Needed only for smart contract wallets (EIP-1271). Use a client for the chain of the message.
const publicClient = createPublicClient({ chain: mainnet, transport: http() });

const result = await verifyEvmSignature(message, signature, { publicClient });

if (result.success) {
  console.log(result.method, result.data?.address); // "eip191" or "eip1271", "eip155:1:0x…"
} else {
  console.error(result.error);
}
```

- Use `verifyEip191` alone when you only accept EOA wallets, and `verifyEip1271` when you know the account is a contract.
- The verifiers do not check the domain, URI, nonce or other policy rules, and do not compare the client chain with the message `chainId`. On a server, use [`@tuwaio/siwx-server`](https://siwx.docs.tuwa.io/packages/siwx-server), which adds the policy and single-use nonces, or run `validatePolicy` from `@tuwaio/siwx-core` yourself.
- `skipExpiration: true` disables the expiration check. Keep it off in production.

---

## 🌐 External Services

The package contacts no hosts of its own. `verifyEip1271`, and `verifyEvmSignature` when it falls back to EIP-1271, send one `eth_call` to the RPC endpoint of the `publicClient` you pass (with viem's `http()` and no URL, that is the default public RPC of the chain). Signing goes through the wallet of the wagmi `Config` or `WalletClient`.

---

## 📚 API Reference

Every export, with signatures and types generated from the source, is documented at **[siwx.docs.tuwa.io/packages/siwx-evm](https://siwx.docs.tuwa.io/packages/siwx-evm)**.

## 📄 License

Licensed under the **Apache-2.0 License**. See the [LICENSE](https://github.com/TuwaIO/siwx/blob/main/packages/siwx-evm/LICENSE) file for details.

## Interfaces

- [EvmVerifyOptions](/packages/siwx-evm/interfaces/EvmVerifyOptions.md)
- [EvmVerifyPayload](/packages/siwx-evm/interfaces/EvmVerifyPayload.md)
- [EvmVerifyResult](/packages/siwx-evm/interfaces/EvmVerifyResult.md)

## Type Aliases

- [EvmSiwxSignerTarget](/packages/siwx-evm/type-aliases/EvmSiwxSignerTarget.md)

## Functions

- [createEvmSiwxSigner](/packages/siwx-evm/functions/createEvmSiwxSigner.md)
- [verifyEip1271](/packages/siwx-evm/functions/verifyEip1271.md)
- [verifyEip191](/packages/siwx-evm/functions/verifyEip191.md)
- [verifyEvmSignature](/packages/siwx-evm/functions/verifyEvmSignature.md)
