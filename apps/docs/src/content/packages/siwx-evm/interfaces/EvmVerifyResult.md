# EvmVerifyResult

Defined in: [siwx-evm/src/types.ts:38](https://github.com/TuwaIO/siwx/blob/main/packages/siwx-evm/src/types.ts#L38)

Result of an EVM verification, with the method that succeeded.

## Extends

- [`SiwxVerifyResult`](/packages/siwx-core/interfaces/SiwxVerifyResult.md)

## Properties

### data?

> `optional` **data?**: [`SiwxMessageFields`](/packages/siwx-core/interfaces/SiwxMessageFields.md)

Defined in: [siwx-core/src/types.ts:218](https://github.com/TuwaIO/siwx/blob/main/packages/siwx-core/src/types.ts#L218)

The parsed message. Present only when `success` is `true`.

#### Inherited from

[`SiwxVerifyResult`](/packages/siwx-core/interfaces/SiwxVerifyResult.md).[`data`](/packages/siwx-core/interfaces/SiwxVerifyResult.md#data)

***

### error?

> `optional` **error?**: `string`

Defined in: [siwx-core/src/types.ts:222](https://github.com/TuwaIO/siwx/blob/main/packages/siwx-core/src/types.ts#L222)

Human-readable reason of the failure. Present only when `success` is `false`.

#### Inherited from

[`SiwxVerifyResult`](/packages/siwx-core/interfaces/SiwxVerifyResult.md).[`error`](/packages/siwx-core/interfaces/SiwxVerifyResult.md#error)

***

### method?

> `optional` **method?**: `"eip191"` \| `"eip1271"`

Defined in: [siwx-evm/src/types.ts:44](https://github.com/TuwaIO/siwx/blob/main/packages/siwx-evm/src/types.ts#L44)

The verification method, set only when `success` is `true`.
- `eip191`: EOA signature recovery.
- `eip1271`: smart contract wallet check via `isValidSignature`.

***

### success

> **success**: `boolean`

Defined in: [siwx-core/src/types.ts:214](https://github.com/TuwaIO/siwx/blob/main/packages/siwx-core/src/types.ts#L214)

`true` when the message is valid and the signature matches its `address`.

#### Inherited from

[`SiwxVerifyResult`](/packages/siwx-core/interfaces/SiwxVerifyResult.md).[`success`](/packages/siwx-core/interfaces/SiwxVerifyResult.md#success)
