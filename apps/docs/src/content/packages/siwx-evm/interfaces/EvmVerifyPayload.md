# EvmVerifyPayload

Defined in: [siwx-evm/src/types.ts:48](https://github.com/TuwaIO/siwx/blob/main/packages/siwx-evm/src/types.ts#L48)

A signed CAIP-122 message with a hex-typed EVM signature. The verifiers of this package take the message and the
signature as separate arguments; this type is provided for typing request bodies.

## Extends

- [`SiwxVerifyPayload`](/packages/siwx-core/interfaces/SiwxVerifyPayload.md)

## Properties

### message

> **message**: `string`

Defined in: [siwx-core/src/types.ts:205](https://github.com/TuwaIO/siwx/blob/main/packages/siwx-core/src/types.ts#L205)

The exact CAIP-122 message string that was signed.

#### Inherited from

[`SiwxVerifyPayload`](/packages/siwx-core/interfaces/SiwxVerifyPayload.md).[`message`](/packages/siwx-core/interfaces/SiwxVerifyPayload.md#message)

***

### signature

> **signature**: `` `0x${string}` ``

Defined in: [siwx-evm/src/types.ts:50](https://github.com/TuwaIO/siwx/blob/main/packages/siwx-evm/src/types.ts#L50)

The hex-encoded (`0x…`) signature returned by the wallet.

#### Overrides

[`SiwxVerifyPayload`](/packages/siwx-core/interfaces/SiwxVerifyPayload.md).[`signature`](/packages/siwx-core/interfaces/SiwxVerifyPayload.md#signature)
