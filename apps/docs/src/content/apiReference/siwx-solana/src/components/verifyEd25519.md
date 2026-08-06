[**API Reference — @tuwaio/siwx (CAIP-122 Authentication Layer)**](../../../README.md)

***

# verifyEd25519()

> **verifyEd25519**(`payload`, `options?`): `Promise`\<`SiwxVerifyResult`\>

Defined in: [packages/siwx-solana/src/verify.ts:74](https://github.com/TuwaIO/siwx/blob/09eb108718ca0fbc6fd96fa980ed6a900a00adb2/packages/siwx-solana/src/verify.ts#L74)

Verifies a Solana CAIP-122 signature using ed25519 cryptography.
Compatible with all Wallet Standard wallets (Phantom, Solflare, Backpack, etc.).

Uses the native `SubtleCrypto` API for ed25519 verification, ensuring
compatibility with both Node.js (v19+) and browser environments.

## Parameters

### payload

`SiwxVerifyPayload`

The CAIP-122 message string and the base58-encoded signature.

### options?

#### skipExpiration?

`boolean`

## Returns

`Promise`\<`SiwxVerifyResult`\>

A `SiwxVerifyResult` with `success: true` and parsed data, or an error result.

## Example

```ts
const result = await verifyEd25519({
  message: rawCaip122Message,
  signature: base58EncodedSignature,
});
if (result.success) console.log('Authenticated:', result.data?.address);
```
