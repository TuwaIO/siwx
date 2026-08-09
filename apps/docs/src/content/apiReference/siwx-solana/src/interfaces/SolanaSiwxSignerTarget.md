[**API Reference — @tuwaio/siwx (CAIP-122 Authentication Layer)**](../../../README.md)

***

# SolanaSiwxSignerTarget

Defined in: [packages/siwx-solana/src/signer.ts:35](https://github.com/TuwaIO/siwx/blob/226309e8a8af6d2fb968b23cea6b3dc7f2a3300b/packages/siwx-solana/src/signer.ts#L35)

Target input for the Solana SIWX signer.
Supports Wallet Standard (`signMessages`), Web3 v2 (`modifyAndSignMessages`), and Legacy (`signMessage`) signers.

## Properties

### account?

> `optional` **account?**: `unknown`

Defined in: [packages/siwx-solana/src/signer.ts:39](https://github.com/TuwaIO/siwx/blob/226309e8a8af6d2fb968b23cea6b3dc7f2a3300b/packages/siwx-solana/src/signer.ts#L39)

***

### address?

> `optional` **address?**: `string`

Defined in: [packages/siwx-solana/src/signer.ts:36](https://github.com/TuwaIO/siwx/blob/226309e8a8af6d2fb968b23cea6b3dc7f2a3300b/packages/siwx-solana/src/signer.ts#L36)

***

### features?

> `optional` **features?**: `Record`\<`string`, `unknown`\>

Defined in: [packages/siwx-solana/src/signer.ts:41](https://github.com/TuwaIO/siwx/blob/226309e8a8af6d2fb968b23cea6b3dc7f2a3300b/packages/siwx-solana/src/signer.ts#L41)

***

### modifyAndSignMessages?

> `optional` **modifyAndSignMessages?**: (`messages`) => `Promise`\<`object`[]\>

Defined in: [packages/siwx-solana/src/signer.ts:43](https://github.com/TuwaIO/siwx/blob/226309e8a8af6d2fb968b23cea6b3dc7f2a3300b/packages/siwx-solana/src/signer.ts#L43)

#### Parameters

##### messages

`unknown`[]

#### Returns

`Promise`\<`object`[]\>

***

### name?

> `optional` **name?**: `string`

Defined in: [packages/siwx-solana/src/signer.ts:37](https://github.com/TuwaIO/siwx/blob/226309e8a8af6d2fb968b23cea6b3dc7f2a3300b/packages/siwx-solana/src/signer.ts#L37)

***

### publicKey?

> `optional` **publicKey?**: `unknown`

Defined in: [packages/siwx-solana/src/signer.ts:38](https://github.com/TuwaIO/siwx/blob/226309e8a8af6d2fb968b23cea6b3dc7f2a3300b/packages/siwx-solana/src/signer.ts#L38)

***

### signMessage?

> `optional` **signMessage?**: (`message`) => `Promise`\<`Uint8Array`\<`ArrayBufferLike`\> \| \{ `signature`: `Uint8Array`; \}\>

Defined in: [packages/siwx-solana/src/signer.ts:44](https://github.com/TuwaIO/siwx/blob/226309e8a8af6d2fb968b23cea6b3dc7f2a3300b/packages/siwx-solana/src/signer.ts#L44)

#### Parameters

##### message

`Uint8Array`

#### Returns

`Promise`\<`Uint8Array`\<`ArrayBufferLike`\> \| \{ `signature`: `Uint8Array`; \}\>

***

### signMessages?

> `optional` **signMessages?**: (`messages`) => `Promise`\<`object`[]\>

Defined in: [packages/siwx-solana/src/signer.ts:42](https://github.com/TuwaIO/siwx/blob/226309e8a8af6d2fb968b23cea6b3dc7f2a3300b/packages/siwx-solana/src/signer.ts#L42)

#### Parameters

##### messages

`Uint8Array`\<`ArrayBufferLike`\>[]

#### Returns

`Promise`\<`object`[]\>

***

### wallet?

> `optional` **wallet?**: `unknown`

Defined in: [packages/siwx-solana/src/signer.ts:40](https://github.com/TuwaIO/siwx/blob/226309e8a8af6d2fb968b23cea6b3dc7f2a3300b/packages/siwx-solana/src/signer.ts#L40)
