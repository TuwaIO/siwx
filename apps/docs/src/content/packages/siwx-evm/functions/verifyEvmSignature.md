# verifyEvmSignature()

> **verifyEvmSignature**(`message`, `signature`, `options?`): `Promise`\<[`EvmVerifyResult`](/packages/siwx-evm/interfaces/EvmVerifyResult.md)\>

Defined in: [siwx-evm/src/verify.ts:198](https://github.com/TuwaIO/siwx/blob/main/packages/siwx-evm/src/verify.ts#L198)

Verifies an `eip155` CAIP-122 signature from an EOA or a smart contract wallet.

Tries [verifyEip191](/packages/siwx-evm/functions/verifyEip191.md) first. If it fails and `options.publicClient` is set, falls back to
[verifyEip1271](/packages/siwx-evm/functions/verifyEip1271.md) with the client of the message chain (one on-chain `eth_call`), which accepts deployed
(EIP-1271) and not yet deployed (ERC-6492) smart contract wallets.

## Parameters

### message

`string`

The exact CAIP-122 message string that was signed.

### signature

`` `0x${string}` ``

The hex-encoded signature returned by the wallet.

### options?

[`EvmVerifyOptions`](/packages/siwx-evm/interfaces/EvmVerifyOptions.md) = `{}`

`publicClient` (a client or a function of the chain number) enables the contract wallet fallback;
`skipExpiration` is passed to both checks.

## Returns

`Promise`\<[`EvmVerifyResult`](/packages/siwx-evm/interfaces/EvmVerifyResult.md)\>

The first successful result (with `method`), otherwise the failed result of the last check that ran.
Never throws.

## Example

```ts
const result = await verifyEvmSignature(rawMessage, '0xdeadbeef...', { publicClient });
if (result.success) console.log('Authenticated via:', result.method);
```
