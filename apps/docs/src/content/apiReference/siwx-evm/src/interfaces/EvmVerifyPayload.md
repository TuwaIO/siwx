[**API Reference — @tuwaio/siwx (CAIP-122 Authentication Layer)**](../../../README.md)

***

# EvmVerifyPayload

Defined in: [packages/siwx-evm/src/types.ts:30](https://github.com/TuwaIO/siwx/blob/09eb108718ca0fbc6fd96fa980ed6a900a00adb2/packages/siwx-evm/src/types.ts#L30)

The payload for EVM signature verification, extending the base SIWX payload
with a typed `signature` field.

## Extends

- `SiwxVerifyPayload`

## Properties

### message

> **message**: `string`

Defined in: packages/siwx-core/dist/index.d.ts:102

The raw CAIP-122 compliant message string that was signed.

#### Inherited from

`SiwxVerifyPayload.message`

***

### signature

> **signature**: `` `0x${string}` ``

Defined in: [packages/siwx-evm/src/types.ts:32](https://github.com/TuwaIO/siwx/blob/09eb108718ca0fbc6fd96fa980ed6a900a00adb2/packages/siwx-evm/src/types.ts#L32)

The EVM hex-encoded signature string.

#### Overrides

`SiwxVerifyPayload.signature`
