# SiwxVerifyResult

Defined in: [types.ts:213](https://github.com/TuwaIO/siwx/blob/main/packages/siwx-core/src/types.ts#L213)

Result of a signature verification. Verification functions return this object instead of throwing.

## Extended by

- [`EvmVerifyResult`](/packages/siwx-evm/interfaces/EvmVerifyResult.md)
- [`ServerVerifyResult`](/packages/siwx-server/server/interfaces/ServerVerifyResult.md)

## Properties

### data?

> `optional` **data?**: [`SiwxMessageFields`](/packages/siwx-core/interfaces/SiwxMessageFields.md)

Defined in: [types.ts:219](https://github.com/TuwaIO/siwx/blob/main/packages/siwx-core/src/types.ts#L219)

The parsed message. Present only when `success` is `true`.

***

### error?

> `optional` **error?**: `string`

Defined in: [types.ts:223](https://github.com/TuwaIO/siwx/blob/main/packages/siwx-core/src/types.ts#L223)

Human-readable reason of the failure. Present only when `success` is `false`.

***

### success

> **success**: `boolean`

Defined in: [types.ts:215](https://github.com/TuwaIO/siwx/blob/main/packages/siwx-core/src/types.ts#L215)

`true` when the message is valid and the signature matches its `address`.
