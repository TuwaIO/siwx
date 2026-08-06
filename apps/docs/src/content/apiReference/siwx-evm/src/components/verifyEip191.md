[**API Reference — @tuwaio/siwx (CAIP-122 Authentication Layer)**](../../../README.md)

***

# verifyEip191()

> **verifyEip191**(`message`, `signature`, `options?`): `Promise`\<[`EvmVerifyResult`](../interfaces/EvmVerifyResult.md)\>

Defined in: [packages/siwx-evm/src/verify.ts:65](https://github.com/TuwaIO/siwx/blob/09eb108718ca0fbc6fd96fa980ed6a900a00adb2/packages/siwx-evm/src/verify.ts#L65)

Verifies an EVM (eip155) CAIP-122 signature using EIP-191 (personal_sign).
This method is used for standard EOA (Externally Owned Account) wallets.

## Parameters

### message

`string`

The raw CAIP-122 message string that was signed.

### signature

`` `0x${string}` ``

The hex-encoded EIP-191 signature from the wallet.

### options?

[`EvmVerifyOptions`](../interfaces/EvmVerifyOptions.md) = `{}`

## Returns

`Promise`\<[`EvmVerifyResult`](../interfaces/EvmVerifyResult.md)\>

An `EvmVerifyResult` with `success: true` and the parsed message, or an error result.

## Example

```ts
const result = await verifyEip191(rawMessage, '0xdeadbeef...');
if (result.success) console.log('Authenticated as:', result.data?.address);
```
