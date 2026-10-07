# @tuwaio/siwx-solana

[![NPM Version](https://img.shields.io/npm/v/@tuwaio/siwx-solana.svg)](https://www.npmjs.com/package/@tuwaio/siwx-solana)
[![License](https://img.shields.io/npm/l/@tuwaio/siwx-solana.svg)](https://github.com/TuwaIO/siwx/blob/main/packages/siwx-solana/LICENSE)

`@tuwaio/siwx-solana` is the Solana Layer 2 (L2) package of **SIWX** (Sign-In With X), the authentication project of TUWA Stage 1 ("Core Auth & Primitives", next to Orbit Utils). Built on **`@tuwaio/siwx-core`** and **`@solana/kit`**, it signs CAIP-122 messages with Solana wallets and verifies `solana` ed25519 signatures with the native Web Crypto API. It does not use the legacy `@solana/web3.js` or `gill`.

---

## 🏛️ Core Capabilities

- **Signing:** `createSolanaSiwxSigner` turns a Wallet Standard wallet and account (typed with `@wallet-standard/base`), an `@solana/kit` message signer or a legacy adapter into the `(message) => signature` function that `useSiwx` from [`@tuwaio/siwx-react`](https://siwx.docs.tuwa.io/packages/siwx-react) expects. Signatures are returned as base58 strings.
- **Verification:** `verifyEd25519` accepts a `{ message, signature }` payload (base58 strings or bytes) or the output of the Wallet Standard `solana:signIn` feature. It requires a `solana` chain and a 64-byte signature, validates the message (format, expiration, `notBefore` and an `issuedAt` in the future) and the address, and checks the signature with `crypto.subtle`. It runs locally, without RPC calls, and returns `{ success, data, error }` instead of throwing.
- **Runtimes:** any runtime whose Web Crypto API supports Ed25519, such as Node.js 20+ and current browsers. No native modules or polyfills.

---

## 💾 Installation

```bash
pnpm add @tuwaio/siwx-solana @tuwaio/siwx-core @tuwaio/orbit-core @solana/kit @wallet-standard/base
```

> [!IMPORTANT]
> `@tuwaio/siwx-core`, `@solana/kit` (>=8.2) and `@wallet-standard/base` (>=1.1.1) are peer dependencies and must be installed alongside `@tuwaio/siwx-solana`.

---

## 🚀 Usage

### Signing with a Wallet Standard wallet

```typescript
import { createSolanaSiwxSigner } from '@tuwaio/siwx-solana';
import type { Wallet, WalletAccount } from '@wallet-standard/base';

declare const wallet: Wallet; // a wallet with the `solana:signMessage` feature
declare const account: WalletAccount; // the connected account, one of `wallet.accounts`
declare const message: string;

const signer = createSolanaSiwxSigner({ wallet, account });

// Opens the wallet prompt. Rejects with "[SIWX-SOLANA] Signing failed: …" (original error in `cause`).
const signature = await signer(message); // base58
```

Pass the Wallet Standard `Wallet` and `WalletAccount` objects. The UI handles of `@wallet-standard/ui` (`UiWallet`, `UiWalletAccount`) only list feature names and cannot sign.

### Signing with other signers

```typescript
import type { MessageModifyingSigner } from '@solana/kit';
import { createSolanaSiwxSigner } from '@tuwaio/siwx-solana';

declare const kitSigner: MessageModifyingSigner; // an @solana/kit message signer
declare const walletAdapter: { signMessage(message: Uint8Array): Promise<Uint8Array> }; // legacy wallet adapter

const signWithKit = createSolanaSiwxSigner(kitSigner);
const signWithAdapter = createSolanaSiwxSigner(walletAdapter);
```

The signer uses the first capability it finds: `modifyAndSignMessages` (an `@solana/kit` `MessageModifyingSigner`), the `solana:signMessage` feature of `wallet.features`, a `signMessages` method, or a legacy `signMessage` method (also on `adapter`).

### Verifying a signature

```typescript
import { verifyEd25519 } from '@tuwaio/siwx-solana';

declare const message: string;
declare const signature: string; // base58, as returned by createSolanaSiwxSigner

const result = await verifyEd25519({ message, signature });

if (result.success) {
  console.log(result.data?.address); // "solana:5eykt4UsFv8P8NJdTREpY1vzqKqZKvdp:…"
} else {
  console.error(result.error);
}
```

The output of the Wallet Standard `solana:signIn` feature can be passed as-is (or as `{ output }`); the signed message must be a CAIP-122 message.

`verifyEd25519` does not check the domain, URI, nonce or other policy rules. On a server, use [`@tuwaio/siwx-server`](https://siwx.docs.tuwa.io/packages/siwx-server), which adds the policy and single-use nonces, or run `validatePolicy` from `@tuwaio/siwx-core` yourself.

---

## 📚 API Reference

Every export, with signatures and types generated from the source, is documented at **[siwx.docs.tuwa.io/packages/siwx-solana](https://siwx.docs.tuwa.io/packages/siwx-solana)**.

## 📄 License

Licensed under the **Apache-2.0 License**. See the [LICENSE](https://github.com/TuwaIO/siwx/blob/main/packages/siwx-solana/LICENSE) file for details.

## Interfaces

- [SolanaLegacyMessageSigner](/packages/siwx-solana/interfaces/SolanaLegacyMessageSigner.md)
- [SolanaSignInAccount](/packages/siwx-solana/interfaces/SolanaSignInAccount.md)
- [SolanaSignInOutput](/packages/siwx-solana/interfaces/SolanaSignInOutput.md)
- [SolanaWalletStandardSignerTarget](/packages/siwx-solana/interfaces/SolanaWalletStandardSignerTarget.md)

## Type Aliases

- [SolanaSiwxSignerTarget](/packages/siwx-solana/type-aliases/SolanaSiwxSignerTarget.md)
- [SolanaVerifyPayload](/packages/siwx-solana/type-aliases/SolanaVerifyPayload.md)

## Functions

- [createSolanaSiwxSigner](/packages/siwx-solana/functions/createSolanaSiwxSigner.md)
- [verifyEd25519](/packages/siwx-solana/functions/verifyEd25519.md)
