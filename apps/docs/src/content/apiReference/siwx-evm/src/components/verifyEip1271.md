[**API Reference — @tuwaio/siwx (CAIP-122 Authentication Layer)**](../../../README.md)

***

# verifyEip1271()

> **verifyEip1271**(`message`, `signature`, `options`): `Promise`\<[`EvmVerifyResult`](../interfaces/EvmVerifyResult.md)\>

Defined in: [packages/siwx-evm/src/verify.ts:120](https://github.com/TuwaIO/siwx/blob/0ca0708dd74b07eb7d1d46e0b3ebb6c65b68bbc8/packages/siwx-evm/src/verify.ts#L120)

Verifies an EVM (eip155) CAIP-122 signature using EIP-1271 (`isValidSignature`).
This method is used for smart contract wallets (e.g., Safe, Argent, Gnosis).

Falls back gracefully if the `publicClient` is not provided.

## Parameters

### message

`string`

The raw CAIP-122 message string that was signed.

### signature

`` `0x${string}` ``

The hex-encoded signature from the smart contract wallet.

### options

[`EvmVerifyOptions`](../interfaces/EvmVerifyOptions.md)

Options including the `publicClient` to use for on-chain calls.

## Returns

`Promise`\<[`EvmVerifyResult`](../interfaces/EvmVerifyResult.md)\>

An `EvmVerifyResult` with `success: true` and the parsed message, or an error result.

## Example

```ts
const result = await verifyEip1271(rawMessage, '0xdeadbeef...', { publicClient });
if (result.success) console.log('Contract wallet authenticated:', result.data?.address);
```
