# verifyEip1271()

> **verifyEip1271**(`message`, `signature`, `options`): `Promise`\<[`EvmVerifyResult`](/packages/siwx-evm/interfaces/EvmVerifyResult.md)\>

Defined in: [siwx-evm/src/verify.ts:128](https://github.com/TuwaIO/siwx/blob/main/packages/siwx-evm/src/verify.ts#L128)

Verifies an `eip155` CAIP-122 message signed by a smart contract wallet (e.g. Safe) using EIP-1271.

Parses and validates the message like [verifyEip191](/packages/siwx-evm/functions/verifyEip191.md), then calls `isValidSignature(hash, signature)` on the
message `address` through `options.publicClient` and expects the magic value `0x1626ba7e`.
Side effect: one `eth_call` to the RPC endpoint of the client.

## Parameters

### message

`string`

The exact CAIP-122 message string that was signed.

### signature

`` `0x${string}` ``

The hex-encoded signature returned by the wallet.

### options

[`EvmVerifyOptions`](/packages/siwx-evm/interfaces/EvmVerifyOptions.md)

Must contain `publicClient`; `skipExpiration` is optional.

## Returns

`Promise`\<[`EvmVerifyResult`](/packages/siwx-evm/interfaces/EvmVerifyResult.md)\>

`{ success: true, data, method: 'eip1271' }`, or `{ success: false, error }` (also when
`publicClient` is missing or the contract call fails). Never throws.

## Example

```ts
const result = await verifyEip1271(rawMessage, '0xdeadbeef...', { publicClient });
if (result.success) console.log('Contract wallet authenticated:', result.data?.address);
```
