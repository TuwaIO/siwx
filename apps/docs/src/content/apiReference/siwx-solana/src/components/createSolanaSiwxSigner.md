[**API Reference — @tuwaio/siwx (CAIP-122 Authentication Layer)**](../../../README.md)

***

# createSolanaSiwxSigner()

> **createSolanaSiwxSigner**(`target`): (`message`) => `Promise`\<`string`\>

Defined in: [packages/siwx-solana/src/signer.ts:179](https://github.com/TuwaIO/siwx/blob/bbc740ccb7f405b75bd0d4e5a1bc973b1e131514/packages/siwx-solana/src/signer.ts#L179)

Creates a standard SIWX signer callback for Solana chains.
Automatically adapts to Wallet Standard, Web3 v2 (gill), or legacy Solana signers.

## Parameters

### target

[`SolanaSiwxSignerTarget`](../interfaces/SolanaSiwxSignerTarget.md)

A Solana signer target containing raw wallet and account, or a direct signer instance.

## Returns

A standardized signer function accepting a message string and returning a promise with the base58 signature.

(`message`) => `Promise`\<`string`\>
