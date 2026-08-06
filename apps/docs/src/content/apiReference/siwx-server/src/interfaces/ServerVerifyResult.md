[**API Reference — @tuwaio/siwx (CAIP-122 Authentication Layer)**](../../../README.md)

***

# ServerVerifyResult

Defined in: [packages/siwx-server/src/types.ts:30](https://github.com/TuwaIO/siwx/blob/09eb108718ca0fbc6fd96fa980ed6a900a00adb2/packages/siwx-server/src/types.ts#L30)

The result of a server-side verification operation, extending the base result
with the verification method used.

## Extends

- `SiwxVerifyResult`

## Properties

### data?

> `optional` **data?**: `SiwxMessageFields`

Defined in: packages/siwx-core/dist/index.d.ts:116

The parsed message fields if verification succeeded.
Present only when `success` is true.

#### Inherited from

`SiwxVerifyResult.data`

***

### error?

> `optional` **error?**: `string`

Defined in: packages/siwx-core/dist/index.d.ts:121

A human-readable error if verification failed.
Present only when `success` is false.

#### Inherited from

`SiwxVerifyResult.error`

***

### namespace?

> `optional` **namespace?**: `"eip155"` \| `"solana"`

Defined in: [packages/siwx-server/src/types.ts:35](https://github.com/TuwaIO/siwx/blob/09eb108718ca0fbc6fd96fa980ed6a900a00adb2/packages/siwx-server/src/types.ts#L35)

The CAIP-2 namespace used for verification routing.
`eip155` for EVM chains, `solana` for Solana.

***

### success

> **success**: `boolean`

Defined in: packages/siwx-core/dist/index.d.ts:111

Whether the signature is valid and the message is authentic.

#### Inherited from

`SiwxVerifyResult.success`
