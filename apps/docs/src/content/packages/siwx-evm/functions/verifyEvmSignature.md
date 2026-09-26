# verifyEvmSignature()

> **verifyEvmSignature**(`message`, `signature`, `options?`): `Promise`\<[`EvmVerifyResult`](/packages/siwx-evm/interfaces/EvmVerifyResult.md)\>

Defined in: [siwx-evm/src/verify.ts:193](https://github.com/TuwaIO/siwx/blob/main/packages/siwx-evm/src/verify.ts#L193)

Verifies an `eip155` CAIP-122 signature from an EOA or a smart contract wallet.

Tries [verifyEip191](/packages/siwx-evm/functions/verifyEip191.md) first. If it fails and `options.publicClient` is set, falls back to
[verifyEip1271](/packages/siwx-evm/functions/verifyEip1271.md) (one on-chain `eth_call`).

## Parameters

### message

`string`

The exact CAIP-122 message string that was signed.

### signature

`` `0x${string}` ``

The hex-encoded signature returned by the wallet.

### options?

[`EvmVerifyOptions`](/packages/siwx-evm/interfaces/EvmVerifyOptions.md) = `{}`

`publicClient` enables the EIP-1271 fallback; `skipExpiration` is passed to both checks.

## Returns

`Promise`\<[`EvmVerifyResult`](/packages/siwx-evm/interfaces/EvmVerifyResult.md)\>

The first successful result (with `method`), otherwise the failed result of the last check that ran.
Never throws.

## Example

```ts
const result = await verifyEvmSignature(rawMessage, '0xdeadbeef...', { publicClient });
if (result.success) console.log('Authenticated via:', result.method);
```
