[**API Reference — @tuwaio/siwx (CAIP-122 Authentication Layer)**](../../../README.md)

***

# SolanaSiwxSignerTarget

Defined in: [packages/siwx-solana/src/signer.ts:11](https://github.com/TuwaIO/siwx/blob/38c3a86a4f2ede00b00c21f5bf6ebea6fa7bbcee/packages/siwx-solana/src/signer.ts#L11)

Target input for the Solana SIWX signer.
Supports Wallet Standard (`signMessages`), Web3 v2 (`modifyAndSignMessages`), and Legacy (`signMessage`) signers.

## Properties

### address?

> `optional` **address?**: `string`

Defined in: [packages/siwx-solana/src/signer.ts:12](https://github.com/TuwaIO/siwx/blob/38c3a86a4f2ede00b00c21f5bf6ebea6fa7bbcee/packages/siwx-solana/src/signer.ts#L12)

***

### modifyAndSignMessages?

> `optional` **modifyAndSignMessages?**: (`messages`) => `Promise`\<`object`[]\>

Defined in: [packages/siwx-solana/src/signer.ts:15](https://github.com/TuwaIO/siwx/blob/38c3a86a4f2ede00b00c21f5bf6ebea6fa7bbcee/packages/siwx-solana/src/signer.ts#L15)

#### Parameters

##### messages

`unknown`[]

#### Returns

`Promise`\<`object`[]\>

***

### publicKey?

> `optional` **publicKey?**: `unknown`

Defined in: [packages/siwx-solana/src/signer.ts:13](https://github.com/TuwaIO/siwx/blob/38c3a86a4f2ede00b00c21f5bf6ebea6fa7bbcee/packages/siwx-solana/src/signer.ts#L13)

***

### signMessage?

> `optional` **signMessage?**: (`message`) => `Promise`\<`Uint8Array`\<`ArrayBufferLike`\> \| \{ `signature`: `Uint8Array`; \}\>

Defined in: [packages/siwx-solana/src/signer.ts:16](https://github.com/TuwaIO/siwx/blob/38c3a86a4f2ede00b00c21f5bf6ebea6fa7bbcee/packages/siwx-solana/src/signer.ts#L16)

#### Parameters

##### message

`Uint8Array`

#### Returns

`Promise`\<`Uint8Array`\<`ArrayBufferLike`\> \| \{ `signature`: `Uint8Array`; \}\>

***

### signMessages?

> `optional` **signMessages?**: (`messages`) => `Promise`\<`object`[]\>

Defined in: [packages/siwx-solana/src/signer.ts:14](https://github.com/TuwaIO/siwx/blob/38c3a86a4f2ede00b00c21f5bf6ebea6fa7bbcee/packages/siwx-solana/src/signer.ts#L14)

#### Parameters

##### messages

`Uint8Array`\<`ArrayBufferLike`\>[]

#### Returns

`Promise`\<`object`[]\>
