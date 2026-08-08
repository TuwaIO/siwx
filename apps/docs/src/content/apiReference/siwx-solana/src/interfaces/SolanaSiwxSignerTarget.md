[**API Reference — @tuwaio/siwx (CAIP-122 Authentication Layer)**](../../../README.md)

***

# SolanaSiwxSignerTarget

Defined in: [packages/siwx-solana/src/signer.ts:11](https://github.com/TuwaIO/siwx/blob/25e4a0067650f7a94ad6029e68a5c6fc790192ab/packages/siwx-solana/src/signer.ts#L11)

Target input for the Solana SIWX signer.
Supports Wallet Standard (`signMessages`), Web3 v2 (`modifyAndSignMessages`), and Legacy (`signMessage`) signers.

## Properties

### account?

> `optional` **account?**: `unknown`

Defined in: [packages/siwx-solana/src/signer.ts:14](https://github.com/TuwaIO/siwx/blob/25e4a0067650f7a94ad6029e68a5c6fc790192ab/packages/siwx-solana/src/signer.ts#L14)

***

### address?

> `optional` **address?**: `string`

Defined in: [packages/siwx-solana/src/signer.ts:12](https://github.com/TuwaIO/siwx/blob/25e4a0067650f7a94ad6029e68a5c6fc790192ab/packages/siwx-solana/src/signer.ts#L12)

***

### features?

> `optional` **features?**: `Record`\<`string`, `unknown`\>

Defined in: [packages/siwx-solana/src/signer.ts:16](https://github.com/TuwaIO/siwx/blob/25e4a0067650f7a94ad6029e68a5c6fc790192ab/packages/siwx-solana/src/signer.ts#L16)

***

### modifyAndSignMessages?

> `optional` **modifyAndSignMessages?**: (`messages`) => `Promise`\<`object`[]\>

Defined in: [packages/siwx-solana/src/signer.ts:18](https://github.com/TuwaIO/siwx/blob/25e4a0067650f7a94ad6029e68a5c6fc790192ab/packages/siwx-solana/src/signer.ts#L18)

#### Parameters

##### messages

`unknown`[]

#### Returns

`Promise`\<`object`[]\>

***

### publicKey?

> `optional` **publicKey?**: `unknown`

Defined in: [packages/siwx-solana/src/signer.ts:13](https://github.com/TuwaIO/siwx/blob/25e4a0067650f7a94ad6029e68a5c6fc790192ab/packages/siwx-solana/src/signer.ts#L13)

***

### signMessage?

> `optional` **signMessage?**: (`message`) => `Promise`\<`Uint8Array`\<`ArrayBufferLike`\> \| \{ `signature`: `Uint8Array`; \}\>

Defined in: [packages/siwx-solana/src/signer.ts:19](https://github.com/TuwaIO/siwx/blob/25e4a0067650f7a94ad6029e68a5c6fc790192ab/packages/siwx-solana/src/signer.ts#L19)

#### Parameters

##### message

`Uint8Array`

#### Returns

`Promise`\<`Uint8Array`\<`ArrayBufferLike`\> \| \{ `signature`: `Uint8Array`; \}\>

***

### signMessages?

> `optional` **signMessages?**: (`messages`) => `Promise`\<`object`[]\>

Defined in: [packages/siwx-solana/src/signer.ts:17](https://github.com/TuwaIO/siwx/blob/25e4a0067650f7a94ad6029e68a5c6fc790192ab/packages/siwx-solana/src/signer.ts#L17)

#### Parameters

##### messages

`Uint8Array`\<`ArrayBufferLike`\>[]

#### Returns

`Promise`\<`object`[]\>

***

### wallet?

> `optional` **wallet?**: `unknown`

Defined in: [packages/siwx-solana/src/signer.ts:15](https://github.com/TuwaIO/siwx/blob/25e4a0067650f7a94ad6029e68a5c6fc790192ab/packages/siwx-solana/src/signer.ts#L15)
