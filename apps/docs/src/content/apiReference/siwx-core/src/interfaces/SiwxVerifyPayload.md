[**API Reference — @tuwaio/siwx (CAIP-122 Authentication Layer)**](../../../README.md)

***

# SiwxVerifyPayload

Defined in: [packages/siwx-core/src/types.ts:185](https://github.com/TuwaIO/siwx/blob/0ca0708dd74b07eb7d1d46e0b3ebb6c65b68bbc8/packages/siwx-core/src/types.ts#L185)

The payload submitted for signature verification.

## Properties

### message

> **message**: `string`

Defined in: [packages/siwx-core/src/types.ts:187](https://github.com/TuwaIO/siwx/blob/0ca0708dd74b07eb7d1d46e0b3ebb6c65b68bbc8/packages/siwx-core/src/types.ts#L187)

The raw CAIP-122 compliant message string that was signed.

***

### signature

> **signature**: `string`

Defined in: [packages/siwx-core/src/types.ts:189](https://github.com/TuwaIO/siwx/blob/0ca0708dd74b07eb7d1d46e0b3ebb6c65b68bbc8/packages/siwx-core/src/types.ts#L189)

The signature produced by the wallet.
