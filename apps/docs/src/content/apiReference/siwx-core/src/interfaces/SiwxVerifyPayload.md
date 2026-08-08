[**API Reference — @tuwaio/siwx (CAIP-122 Authentication Layer)**](../../../README.md)

***

# SiwxVerifyPayload

Defined in: [packages/siwx-core/src/types.ts:118](https://github.com/TuwaIO/siwx/blob/626c94cfe8fcb8d8d8caa69ff91c81d6883a0fec/packages/siwx-core/src/types.ts#L118)

The payload submitted for signature verification.

## Properties

### message

> **message**: `string`

Defined in: [packages/siwx-core/src/types.ts:120](https://github.com/TuwaIO/siwx/blob/626c94cfe8fcb8d8d8caa69ff91c81d6883a0fec/packages/siwx-core/src/types.ts#L120)

The raw CAIP-122 compliant message string that was signed.

***

### signature

> **signature**: `string`

Defined in: [packages/siwx-core/src/types.ts:122](https://github.com/TuwaIO/siwx/blob/626c94cfe8fcb8d8d8caa69ff91c81d6883a0fec/packages/siwx-core/src/types.ts#L122)

The signature produced by the wallet.
