[**API Reference — @tuwaio/siwx (CAIP-122 Authentication Layer)**](../../../README.md)

***

# SiwxAdapter

Defined in: [packages/siwx-core/src/types.ts:213](https://github.com/TuwaIO/siwx/blob/21b3a05b39d40806567e8859c0d7699b6b50336c/packages/siwx-core/src/types.ts#L213)

A chain-specific adapter interface that all siwx chain packages must implement.

## Properties

### namespace

> **namespace**: [`SiwxChainNamespace`](../type-aliases/SiwxChainNamespace.md)

Defined in: [packages/siwx-core/src/types.ts:217](https://github.com/TuwaIO/siwx/blob/21b3a05b39d40806567e8859c0d7699b6b50336c/packages/siwx-core/src/types.ts#L217)

The CAIP-2 namespace this adapter handles.

## Methods

### verify()

> **verify**(`payload`): `Promise`\<[`SiwxVerifyResult`](SiwxVerifyResult.md)\>

Defined in: [packages/siwx-core/src/types.ts:224](https://github.com/TuwaIO/siwx/blob/21b3a05b39d40806567e8859c0d7699b6b50336c/packages/siwx-core/src/types.ts#L224)

Verifies a CAIP-122 payload signature.

#### Parameters

##### payload

[`SiwxVerifyPayload`](SiwxVerifyPayload.md)

The message and signature to verify.

#### Returns

`Promise`\<[`SiwxVerifyResult`](SiwxVerifyResult.md)\>

A promise resolving to the verification result.
