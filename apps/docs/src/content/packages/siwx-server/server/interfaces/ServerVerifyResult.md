# ServerVerifyResult

Defined in: [siwx-server/src/types.ts:43](https://github.com/TuwaIO/siwx/blob/main/packages/siwx-server/src/types.ts#L43)

Result of [verifySiwxPayload](/packages/siwx-server/server/functions/verifySiwxPayload.md).

## Extends

- [`SiwxVerifyResult`](/packages/siwx-core/interfaces/SiwxVerifyResult.md)

## Properties

### data?

> `optional` **data?**: [`SiwxMessageFields`](/packages/siwx-server/server/interfaces/SiwxMessageFields.md)

Defined in: [siwx-core/src/types.ts:219](https://github.com/TuwaIO/siwx/blob/main/packages/siwx-core/src/types.ts#L219)

The parsed message. Present only when `success` is `true`.

#### Inherited from

[`SiwxVerifyResult`](/packages/siwx-core/interfaces/SiwxVerifyResult.md).[`data`](/packages/siwx-core/interfaces/SiwxVerifyResult.md#data)

***

### error?

> `optional` **error?**: `string`

Defined in: [siwx-core/src/types.ts:223](https://github.com/TuwaIO/siwx/blob/main/packages/siwx-core/src/types.ts#L223)

Human-readable reason of the failure. Present only when `success` is `false`.

#### Inherited from

[`SiwxVerifyResult`](/packages/siwx-core/interfaces/SiwxVerifyResult.md).[`error`](/packages/siwx-core/interfaces/SiwxVerifyResult.md#error)

***

### namespace?

> `optional` **namespace?**: `"solana"` \| `"eip155"`

Defined in: [siwx-server/src/types.ts:48](https://github.com/TuwaIO/siwx/blob/main/packages/siwx-server/src/types.ts#L48)

The CAIP-2 namespace whose verifier checked the signature: `eip155` or `solana`. Absent when verification
failed before the signature check.

***

### success

> **success**: `boolean`

Defined in: [siwx-core/src/types.ts:215](https://github.com/TuwaIO/siwx/blob/main/packages/siwx-core/src/types.ts#L215)

`true` when the message is valid and the signature matches its `address`.

#### Inherited from

[`SiwxVerifyResult`](/packages/siwx-core/interfaces/SiwxVerifyResult.md).[`success`](/packages/siwx-core/interfaces/SiwxVerifyResult.md#success)
