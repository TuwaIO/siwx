# SiwxVerifyPayload

Defined in: [types.ts:203](https://github.com/TuwaIO/siwx/blob/main/packages/siwx-core/src/types.ts#L203)

A signed CAIP-122 message, as sent from the client to the verifier.

## Extended by

- [`EvmVerifyPayload`](/packages/siwx-evm/interfaces/EvmVerifyPayload.md)

## Properties

### message

> **message**: `string`

Defined in: [types.ts:205](https://github.com/TuwaIO/siwx/blob/main/packages/siwx-core/src/types.ts#L205)

The exact CAIP-122 message string that was signed.

***

### signature

> **signature**: `string`

Defined in: [types.ts:207](https://github.com/TuwaIO/siwx/blob/main/packages/siwx-core/src/types.ts#L207)

The wallet signature: hex (`0x…`) for EVM, base58 for Solana.
