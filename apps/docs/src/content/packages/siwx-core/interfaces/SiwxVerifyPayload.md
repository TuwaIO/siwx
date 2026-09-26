# SiwxVerifyPayload

Defined in: [types.ts:202](https://github.com/TuwaIO/siwx/blob/main/packages/siwx-core/src/types.ts#L202)

A signed CAIP-122 message, as sent from the client to the verifier.

## Extended by

- [`EvmVerifyPayload`](/packages/siwx-evm/interfaces/EvmVerifyPayload.md)

## Properties

### message

> **message**: `string`

Defined in: [types.ts:204](https://github.com/TuwaIO/siwx/blob/main/packages/siwx-core/src/types.ts#L204)

The exact CAIP-122 message string that was signed.

***

### signature

> **signature**: `string`

Defined in: [types.ts:206](https://github.com/TuwaIO/siwx/blob/main/packages/siwx-core/src/types.ts#L206)

The wallet signature: hex (`0x…`) for EVM, base58 for Solana.
