[**API Reference — @tuwaio/siwx (CAIP-122 Authentication Layer)**](../../../README.md)

***

# createSolanaSiwxSigner()

> **createSolanaSiwxSigner**(`target`): (`message`) => `Promise`\<`string`\>

Defined in: [packages/siwx-solana/src/signer.ts:160](https://github.com/TuwaIO/siwx/blob/bac8be290114bb4720f42e8f92d70040e76d06fe/packages/siwx-solana/src/signer.ts#L160)

Creates a standard SIWX signer callback for Solana chains.
Automatically adapts to Wallet Standard, Web3 v2 (gill), or legacy Solana signers.

## Parameters

### target

[`SolanaSiwxSignerTarget`](../interfaces/SolanaSiwxSignerTarget.md)

A Solana signer target containing the raw wallet and account.

## Returns

A standardized signer function accepting a message string and returning a promise with the base58 signature.

(`message`) => `Promise`\<`string`\>
