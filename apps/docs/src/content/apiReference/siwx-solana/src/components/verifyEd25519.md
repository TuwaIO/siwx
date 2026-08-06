[**API Reference — @tuwaio/siwx (CAIP-122 Authentication Layer)**](../../../README.md)

***

# verifyEd25519()

> **verifyEd25519**(`payload`, `options?`): `Promise`\<`SiwxVerifyResult`\>

Defined in: [packages/siwx-solana/src/verify.ts:111](https://github.com/TuwaIO/siwx/blob/b9b124994d5ac633a6d509fd0c9a5e5efdaac504/packages/siwx-solana/src/verify.ts#L111)

Verifies a Solana CAIP-122 signature using ed25519 cryptography.
Compatible with all Wallet Standard wallets (Phantom, Solflare, Backpack, etc.)
and accepts raw `solana:signIn` output objects as well as string payloads.

Uses the native `SubtleCrypto` API for ed25519 verification, ensuring
compatibility with both Node.js (v19+) and browser environments without polyfills.

## Parameters

### payload

[`SolanaVerifyPayload`](../type-aliases/SolanaVerifyPayload.md)

Standard SIWX payload, Uint8Array buffers, or Wallet Standard `solana:signIn` output.

### options?

Verification options.

#### skipExpiration?

`boolean`

## Returns

`Promise`\<`SiwxVerifyResult`\>

A `SiwxVerifyResult` with `success: true` and parsed data, or an error result.

## Example

```ts
const result = await verifyEd25519(solanaSignInOutput);
if (result.success) console.log('Authenticated:', result.data?.address);
```
