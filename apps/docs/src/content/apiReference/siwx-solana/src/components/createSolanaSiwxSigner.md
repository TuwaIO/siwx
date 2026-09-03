[**API Reference — @tuwaio/siwx (CAIP-122 Authentication Layer)**](../../../README.md)

***

# createSolanaSiwxSigner()

> **createSolanaSiwxSigner**(`target`): (`message`) => `Promise`\<`string`\>

Defined in: [packages/siwx-solana/src/signer.ts:200](https://github.com/TuwaIO/siwx/blob/7a4dd6dae3d09a536e9c8ec7c5ea5bf16941b2e9/packages/siwx-solana/src/signer.ts#L200)

Creates a standard SIWX signer callback for Solana chains.
Automatically adapts to Wallet Standard, Web3 v2 (@solana/kit), or legacy Solana signers.

## Parameters

### target

[`SolanaSiwxSignerTarget`](../interfaces/SolanaSiwxSignerTarget.md)

A Solana signer target containing raw wallet and account, or a direct signer instance.

## Returns

A standardized signer function accepting a message string and returning a promise with the base58 signature.

(`message`) => `Promise`\<`string`\>
