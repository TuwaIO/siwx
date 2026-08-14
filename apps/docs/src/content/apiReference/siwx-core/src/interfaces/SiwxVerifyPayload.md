[**API Reference — @tuwaio/siwx (CAIP-122 Authentication Layer)**](../../../README.md)

***

# SiwxVerifyPayload

Defined in: [packages/siwx-core/src/types.ts:185](https://github.com/TuwaIO/siwx/blob/5afdbf8444bc2b94d7f938774996543e40e8ee51/packages/siwx-core/src/types.ts#L185)

The payload submitted for signature verification.

## Properties

### message

> **message**: `string`

Defined in: [packages/siwx-core/src/types.ts:187](https://github.com/TuwaIO/siwx/blob/5afdbf8444bc2b94d7f938774996543e40e8ee51/packages/siwx-core/src/types.ts#L187)

The raw CAIP-122 compliant message string that was signed.

***

### signature

> **signature**: `string`

Defined in: [packages/siwx-core/src/types.ts:189](https://github.com/TuwaIO/siwx/blob/5afdbf8444bc2b94d7f938774996543e40e8ee51/packages/siwx-core/src/types.ts#L189)

The signature produced by the wallet.
