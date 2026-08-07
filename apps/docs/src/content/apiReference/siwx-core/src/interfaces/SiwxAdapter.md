[**API Reference — @tuwaio/siwx (CAIP-122 Authentication Layer)**](../../../README.md)

***

# SiwxAdapter

Defined in: [packages/siwx-core/src/types.ts:146](https://github.com/TuwaIO/siwx/blob/38c3a86a4f2ede00b00c21f5bf6ebea6fa7bbcee/packages/siwx-core/src/types.ts#L146)

A chain-specific adapter interface that all siwx chain packages must implement.

## Properties

### namespace

> **namespace**: [`SiwxChainNamespace`](../type-aliases/SiwxChainNamespace.md)

Defined in: [packages/siwx-core/src/types.ts:150](https://github.com/TuwaIO/siwx/blob/38c3a86a4f2ede00b00c21f5bf6ebea6fa7bbcee/packages/siwx-core/src/types.ts#L150)

The CAIP-2 namespace this adapter handles.

## Methods

### verify()

> **verify**(`payload`): `Promise`\<[`SiwxVerifyResult`](SiwxVerifyResult.md)\>

Defined in: [packages/siwx-core/src/types.ts:157](https://github.com/TuwaIO/siwx/blob/38c3a86a4f2ede00b00c21f5bf6ebea6fa7bbcee/packages/siwx-core/src/types.ts#L157)

Verifies a CAIP-122 payload signature.

#### Parameters

##### payload

[`SiwxVerifyPayload`](SiwxVerifyPayload.md)

The message and signature to verify.

#### Returns

`Promise`\<[`SiwxVerifyResult`](SiwxVerifyResult.md)\>

A promise resolving to the verification result.
