[**API Reference — @tuwaio/siwx (CAIP-122 Authentication Layer)**](../../../README.md)

***

# createEvmSiwxSigner()

> **createEvmSiwxSigner**(`target`, `account?`): (`message`) => `Promise`\<`string`\>

Defined in: [packages/siwx-evm/src/signer.ts:28](https://github.com/TuwaIO/siwx/blob/937790ab6674ad6603e43d2020db35b698d6f5b0/packages/siwx-evm/src/signer.ts#L28)

Creates a standard SIWX signer callback for EVM chains.
Automatically adapts to either a Wagmi Config or a Viem WalletClient.

## Parameters

### target

[`EvmSiwxSignerTarget`](../type-aliases/EvmSiwxSignerTarget.md)

A Wagmi `Config` instance or a Viem `WalletClient`.

### account?

`` `0x${string}` ``

Optional account address to sign with. If omitted, uses the active connector/account.

## Returns

A standardized signer function accepting a message string and returning a promise with the hex signature.

(`message`) => `Promise`\<`string`\>

## Example

```ts
const signer = createEvmSiwxSigner(wagmiConfig);
const signature = await signer("Mini-Session Login: ...");
```
