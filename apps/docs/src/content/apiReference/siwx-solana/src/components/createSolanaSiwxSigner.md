[**API Reference — @tuwaio/siwx (CAIP-122 Authentication Layer)**](../../../README.md)

***

# createSolanaSiwxSigner()

> **createSolanaSiwxSigner**(`signer`): (`message`) => `Promise`\<`string`\>

Defined in: [packages/siwx-solana/src/signer.ts:32](https://github.com/TuwaIO/siwx/blob/b9b124994d5ac633a6d509fd0c9a5e5efdaac504/packages/siwx-solana/src/signer.ts#L32)

Creates a standard SIWX signer callback for Solana chains.
Automatically adapts to Wallet Standard, Web3 v2 (gill), or legacy Solana signers.

## Parameters

### signer

[`SolanaSiwxSignerTarget`](../interfaces/SolanaSiwxSignerTarget.md)

A Solana signer object containing signing capabilities.

## Returns

A standardized signer function accepting a message string and returning a promise with the base58 signature.

(`message`) => `Promise`\<`string`\>

## Example

```ts
const signer = createSolanaSiwxSigner(connectedAccount);
const signature = await signer("Mini-Session Login: ...");
```
