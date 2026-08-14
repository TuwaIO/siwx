[**API Reference — @tuwaio/siwx (CAIP-122 Authentication Layer)**](../../../README.md)

***

# EvmVerifyPayload

Defined in: [packages/siwx-evm/src/types.ts:30](https://github.com/TuwaIO/siwx/blob/3e92d2c12c74ad4820f3f675f56b978c23099c12/packages/siwx-evm/src/types.ts#L30)

The payload for EVM signature verification, extending the base SIWX payload
with a typed `signature` field.

## Extends

- `SiwxVerifyPayload`

## Properties

### message

> **message**: `string`

Defined in: packages/siwx-core/dist/index.d.ts:159

The raw CAIP-122 compliant message string that was signed.

#### Inherited from

`SiwxVerifyPayload.message`

***

### signature

> **signature**: `` `0x${string}` ``

Defined in: [packages/siwx-evm/src/types.ts:32](https://github.com/TuwaIO/siwx/blob/3e92d2c12c74ad4820f3f675f56b978c23099c12/packages/siwx-evm/src/types.ts#L32)

The EVM hex-encoded signature string.

#### Overrides

`SiwxVerifyPayload.signature`
