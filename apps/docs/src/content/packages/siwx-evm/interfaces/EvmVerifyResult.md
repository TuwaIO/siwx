# EvmVerifyResult

Defined in: [siwx-evm/src/types.ts:56](https://github.com/TuwaIO/siwx/blob/main/packages/siwx-evm/src/types.ts#L56)

Result of an EVM verification, with the method that succeeded.

## Extends

- [`SiwxVerifyResult`](/packages/siwx-core/interfaces/SiwxVerifyResult.md)

## Properties

### data?

> `optional` **data?**: [`SiwxMessageFields`](/packages/siwx-core/interfaces/SiwxMessageFields.md)

Defined in: [siwx-core/src/types.ts:219](https://github.com/TuwaIO/siwx/blob/main/packages/siwx-core/src/types.ts#L219)

The parsed message. Present only when `success` is `true`.

#### Inherited from

[`SiwxVerifyResult`](/packages/siwx-core/interfaces/SiwxVerifyResult.md).[`data`](/packages/siwx-core/interfaces/SiwxVerifyResult.md#data)

***

### error?

> `optional` **error?**: `string`

Defined in: [siwx-core/src/types.ts:223](https://github.com/TuwaIO/siwx/blob/main/packages/siwx-core/src/types.ts#L223)

Human-readable reason of the failure. Present only when `success` is `false`.

#### Inherited from

[`SiwxVerifyResult`](/packages/siwx-core/interfaces/SiwxVerifyResult.md).[`error`](/packages/siwx-core/interfaces/SiwxVerifyResult.md#error)

***

### method?

> `optional` **method?**: `"eip191"` \| `"eip1271"` \| `"erc6492"`

Defined in: [siwx-evm/src/types.ts:63](https://github.com/TuwaIO/siwx/blob/main/packages/siwx-evm/src/types.ts#L63)

The verification method, set only when `success` is `true`.
- `eip191`: EOA signature recovery.
- `eip1271`: smart contract wallet check (`isValidSignature` of a deployed wallet).
- `erc6492`: smart contract wallet that is not deployed yet and signed with an ERC-6492 wrapper.

***

### success

> **success**: `boolean`

Defined in: [siwx-core/src/types.ts:215](https://github.com/TuwaIO/siwx/blob/main/packages/siwx-core/src/types.ts#L215)

`true` when the message is valid and the signature matches its `address`.

#### Inherited from

[`SiwxVerifyResult`](/packages/siwx-core/interfaces/SiwxVerifyResult.md).[`success`](/packages/siwx-core/interfaces/SiwxVerifyResult.md#success)
