# `@tuwaio/siwx-solana`

[![NPM Version](https://img.shields.io/npm/v/@tuwaio/siwx-solana.svg)](https://www.npmjs.com/package/@tuwaio/siwx-solana)
[![License](https://img.shields.io/npm/l/@tuwaio/siwx-solana.svg)](./LICENSE)

> Solana adapter for `@tuwaio/siwx` (L2). Verifies CAIP-122 messages for Solana using native ed25519 cryptography via SubtleCrypto. Compatible with all Wallet Standard wallets.

---

## Responsibility

- **ed25519 Verification**: Verifies Solana wallet signatures against CAIP-122 messages using the native `SubtleCrypto` API (no native module dependencies).
- Extracts and validates Solana addresses from CAIP-10 strings using `gill`.
- Compatible with Node.js (v19+), browsers, and Edge runtimes (Cloudflare Workers, Vercel Edge).

---

## Installation

```bash
pnpm add @tuwaio/siwx-solana @tuwaio/siwx-core gill
```

---

## API

### `verifyEd25519(payload, options?): Promise<SiwxVerifyResult>`

Verifies a Solana wallet signature. The signature must be base58-encoded (as produced by all Wallet Standard adapters). Accepts optional `options?: { skipExpiration?: boolean }`.

```ts
import { verifyEd25519 } from '@tuwaio/siwx-solana';

const result = await verifyEd25519({
  message: rawCaip122Message,
  signature: base58EncodedSignature,
});

if (result.success) {
  console.log('Solana auth verified for:', result.data?.address);
}
```

---

## Wallet Standard Integration

When using a Wallet Standard compatible wallet (Phantom, Solflare, Backpack):

```ts
import { buildMessage, generateNonce } from '@tuwaio/siwx-core';
import { verifyEd25519 } from '@tuwaio/siwx-solana';

// 1. Build the message
const message = buildMessage({ ... });

// 2. Sign with wallet (Wallet Standard)
const encodedMessage = new TextEncoder().encode(message);
const { signature } = await wallet.features['standard:signMessage'].signMessage({
  message: encodedMessage,
  account: wallet.accounts[0],
});

// 3. Convert Uint8Array signature to base58 and verify
const result = await verifyEd25519({ message, signature: base58Signature });
```

---

## Peer Dependencies

| Package                 | Version       |
| ----------------------- | ------------- |
| `@tuwaio/siwx-core`     | `workspace:*` |
| `gill`                  | `^0.14.0`     |
| `@wallet-standard/base` | `^1.0.0`      |

---

## 📄 License

Licensed under the **Apache-2.0 License**. See the [LICENSE](./LICENSE) file for details.
