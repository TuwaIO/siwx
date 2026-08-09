[**API Reference — @tuwaio/siwx (CAIP-122 Authentication Layer)**](../../../README.md)

***

# verifyEvmSignature()

> **verifyEvmSignature**(`message`, `signature`, `options?`): `Promise`\<[`EvmVerifyResult`](../interfaces/EvmVerifyResult.md)\>

Defined in: [packages/siwx-evm/src/verify.ts:183](https://github.com/TuwaIO/siwx/blob/226309e8a8af6d2fb968b23cea6b3dc7f2a3300b/packages/siwx-evm/src/verify.ts#L183)

Universal EVM signature verifier for CAIP-122 messages.
Tries EIP-191 (standard EOA ecrecover) first.
If EIP-191 fails and a `publicClient` is provided, automatically falls back to EIP-1271 (`isValidSignature`).

## Parameters

### message

`string`

The raw CAIP-122 message string that was signed.

### signature

`` `0x${string}` ``

The hex-encoded signature from the wallet.

### options?

[`EvmVerifyOptions`](../interfaces/EvmVerifyOptions.md) = `{}`

Options including optional `publicClient` for smart contract wallets.

## Returns

`Promise`\<[`EvmVerifyResult`](../interfaces/EvmVerifyResult.md)\>

An `EvmVerifyResult` indicating success or failure and the method used (`eip191` or `eip1271`).

## Example

```ts
const result = await verifyEvmSignature(rawMessage, '0xdeadbeef...', { publicClient });
if (result.success) console.log('Authenticated via:', result.method);
```
