# `@tuwaio/siwx-evm`

[![NPM Version](https://img.shields.io/npm/v/@tuwaio/siwx-evm.svg)](https://www.npmjs.com/package/@tuwaio/siwx-evm)
[![License](https://img.shields.io/npm/l/@tuwaio/siwx-evm.svg)](./LICENSE)

> EVM adapter for `@tuwaio/siwx` (L2). Signs and verifies CAIP-122 messages for `eip155` chains via `viem`, including EIP-1271 smart contract wallet support.

---

## Responsibility

- **EIP-191 Verification**: Standard EOA (Externally Owned Account) signature verification using `viem`'s `recoverAddress`.
- **EIP-1271 Verification**: Smart contract wallet verification (`isValidSignature`) via an on-chain `readContract` call using a `viem` `PublicClient`.
- Extracts and normalizes EVM addresses from CAIP-10 strings.

---

## Installation

```bash
pnpm add @tuwaio/siwx-evm @tuwaio/siwx-core viem @wagmi/core
```

---

## API

### `createEvmSiwxSigner(target, account?)`

Creates a standard SIWX signer callback for EVM chains. Automatically adapts to either a Wagmi `Config` or a Viem `WalletClient`.

```ts
import { createEvmSiwxSigner } from '@tuwaio/siwx-evm';

const signer = createEvmSiwxSigner(walletClient);
const signature = await signer('Message to sign');
```

### `verifyEip191(message, signature, options?): Promise<EvmVerifyResult>`

Verifies a standard EOA wallet signature. Recovers the signer address and compares it to the CAIP-10 address embedded in the message. Accept optional `options?: EvmVerifyOptions` (e.g. `{ skipExpiration?: boolean }`).

```ts
import { verifyEip191 } from '@tuwaio/siwx-evm';

const result = await verifyEip191(rawMessage, '0xsignature...');
if (result.success) {
  console.log('Verified via EIP-191. Address:', result.data?.address);
}
```

### `verifyEip1271(message, signature, options?): Promise<EvmVerifyResult>`

Verifies a smart contract wallet signature (Safe, Argent, Gnosis, etc.) by calling `isValidSignature` on-chain. Requires a `viem` `PublicClient` passed via `options.publicClient`. Accept optional `{ skipExpiration?: boolean }`.

```ts
import { verifyEip1271 } from '@tuwaio/siwx-evm';
import { createPublicClient, http } from 'viem';
import { mainnet } from 'viem/chains';

const publicClient = createPublicClient({ chain: mainnet, transport: http() });

const result = await verifyEip1271(rawMessage, '0xsignature...', { publicClient });
if (result.success) {
  console.log('Verified via EIP-1271 (contract wallet)');
}
```

---

## Peer Dependencies

| Package             | Version       |
| ------------------- | ------------- |
| `@tuwaio/siwx-core` | `workspace:*` |
| `viem`              | `^2.0.0`      |
| `@wagmi/core`       | `^3.0.0`      |

---

## 📄 License

Licensed under the **Apache-2.0 License**. See the [LICENSE](./LICENSE) file for details.
