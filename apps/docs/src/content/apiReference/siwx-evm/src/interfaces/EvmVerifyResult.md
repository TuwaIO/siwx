[**API Reference — @tuwaio/siwx (CAIP-122 Authentication Layer)**](../../../README.md)

***

# EvmVerifyResult

Defined in: [packages/siwx-evm/src/types.ts:38](https://github.com/TuwaIO/siwx/blob/5afdbf8444bc2b94d7f938774996543e40e8ee51/packages/siwx-evm/src/types.ts#L38)

Result of an EIP-1271 contract signature check, indicating which verification path was used.

## Extends

- `SiwxVerifyResult`

## Properties

### data?

> `optional` **data?**: [`SiwxMessageFields`](../../../siwx-react/src/interfaces/SiwxMessageFields.md)

Defined in: packages/siwx-core/dist/index.d.ts:173

The parsed message fields if verification succeeded.
Present only when `success` is true.

#### Inherited from

`SiwxVerifyResult.data`

***

### error?

> `optional` **error?**: `string`

Defined in: packages/siwx-core/dist/index.d.ts:178

A human-readable error if verification failed.
Present only when `success` is false.

#### Inherited from

`SiwxVerifyResult.error`

***

### method?

> `optional` **method?**: `"eip191"` \| `"eip1271"`

Defined in: [packages/siwx-evm/src/types.ts:44](https://github.com/TuwaIO/siwx/blob/5afdbf8444bc2b94d7f938774996543e40e8ee51/packages/siwx-evm/src/types.ts#L44)

The method used for verification.
- `eip191`: Standard EOA signature recovery.
- `eip1271`: Smart contract wallet verification via `isValidSignature`.

***

### success

> **success**: `boolean`

Defined in: packages/siwx-core/dist/index.d.ts:168

Whether the signature is valid and the message is authentic.

#### Inherited from

`SiwxVerifyResult.success`
