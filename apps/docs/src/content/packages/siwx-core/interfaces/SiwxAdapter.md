# SiwxAdapter

Defined in: [types.ts:232](https://github.com/TuwaIO/siwx/blob/main/packages/siwx-core/src/types.ts#L232)

Shape of a verifier for one CAIP-2 namespace.

The SIWX packages do not implement or consume this interface: the chain packages export plain functions
(`verifyEvmSignature` in `@tuwaio/siwx-evm`, `verifyEd25519` in `@tuwaio/siwx-solana`) that you can wrap into it
to build your own namespace registry.

## Properties

### namespace

> **namespace**: [`SiwxChainNamespace`](/packages/siwx-core/type-aliases/SiwxChainNamespace.md)

Defined in: [types.ts:236](https://github.com/TuwaIO/siwx/blob/main/packages/siwx-core/src/types.ts#L236)

CAIP-2 namespace handled by the adapter.

## Methods

### verify()

> **verify**(`payload`): `Promise`\<[`SiwxVerifyResult`](/packages/siwx-core/interfaces/SiwxVerifyResult.md)\>

Defined in: [types.ts:243](https://github.com/TuwaIO/siwx/blob/main/packages/siwx-core/src/types.ts#L243)

Verifies a signed CAIP-122 message.

#### Parameters

##### payload

[`SiwxVerifyPayload`](/packages/siwx-core/interfaces/SiwxVerifyPayload.md)

The message and signature to verify.

#### Returns

`Promise`\<[`SiwxVerifyResult`](/packages/siwx-core/interfaces/SiwxVerifyResult.md)\>

A promise resolving to the verification result.
