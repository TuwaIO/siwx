# verifyEip1271()

> **verifyEip1271**(`message`, `signature`, `options`): `Promise`\<[`EvmVerifyResult`](/packages/siwx-evm/interfaces/EvmVerifyResult.md)\>

Defined in: [siwx-evm/src/verify.ts:136](https://github.com/TuwaIO/siwx/blob/main/packages/siwx-evm/src/verify.ts#L136)

Verifies an `eip155` CAIP-122 message signed by a smart contract wallet (Safe, Coinbase Smart Wallet / Base
Account, ERC-4337 accounts), deployed or not.

Parses and validates the message like [verifyEip191](/packages/siwx-evm/functions/verifyEip191.md), takes the client of the message chain from
`options.publicClient` and checks the signature with viem's `verifyMessage`: `isValidSignature` (EIP-1271) of a
deployed wallet, and the ERC-6492 wrapper of a wallet that is not deployed yet, both in one `eth_call` through the
ERC-6492 universal validator (which also accepts an EOA signature). A single client of another chain is never used:
a contract wallet can only be checked on the chain it signed for.
Side effects: calls the client function, if one is given; one `eth_call` to the RPC endpoint of the client.

## Parameters

### message

`string`

The exact CAIP-122 message string that was signed.

### signature

`` `0x${string}` ``

The hex-encoded signature returned by the wallet, ERC-6492 wrapped or not.

### options

[`EvmVerifyOptions`](/packages/siwx-evm/interfaces/EvmVerifyOptions.md)

Must contain `publicClient`; `skipExpiration` is optional.

## Returns

`Promise`\<[`EvmVerifyResult`](/packages/siwx-evm/interfaces/EvmVerifyResult.md)\>

`{ success: true, data, method: 'eip1271' }` (`'erc6492'` for a wrapped signature), or
`{ success: false, error }` (also when there is no client for the message chain or the call fails). Never throws.

## Example

```ts
const result = await verifyEip1271(rawMessage, '0xdeadbeef...', { publicClient });
if (result.success) console.log('Contract wallet authenticated:', result.data?.address);
```
