# ServerVerifyResult

Defined in: [siwx-server/src/types.ts:41](https://github.com/TuwaIO/siwx/blob/main/packages/siwx-server/src/types.ts#L41)

Result of [verifySiwxPayload](/packages/siwx-server/server/functions/verifySiwxPayload.md).

## Extends

- [`SiwxVerifyResult`](/packages/siwx-core/interfaces/SiwxVerifyResult.md)

## Properties

### data?

> `optional` **data?**: [`SiwxMessageFields`](/packages/siwx-server/server/interfaces/SiwxMessageFields.md)

Defined in: [siwx-core/src/types.ts:218](https://github.com/TuwaIO/siwx/blob/main/packages/siwx-core/src/types.ts#L218)

The parsed message. Present only when `success` is `true`.

#### Inherited from

[`SiwxVerifyResult`](/packages/siwx-core/interfaces/SiwxVerifyResult.md).[`data`](/packages/siwx-core/interfaces/SiwxVerifyResult.md#data)

***

### error?

> `optional` **error?**: `string`

Defined in: [siwx-core/src/types.ts:222](https://github.com/TuwaIO/siwx/blob/main/packages/siwx-core/src/types.ts#L222)

Human-readable reason of the failure. Present only when `success` is `false`.

#### Inherited from

[`SiwxVerifyResult`](/packages/siwx-core/interfaces/SiwxVerifyResult.md).[`error`](/packages/siwx-core/interfaces/SiwxVerifyResult.md#error)

***

### namespace?

> `optional` **namespace?**: `"solana"` \| `"eip155"`

Defined in: [siwx-server/src/types.ts:46](https://github.com/TuwaIO/siwx/blob/main/packages/siwx-server/src/types.ts#L46)

The CAIP-2 namespace whose verifier checked the signature: `eip155` or `solana`. Absent when verification
failed before the signature check.

***

### success

> **success**: `boolean`

Defined in: [siwx-core/src/types.ts:214](https://github.com/TuwaIO/siwx/blob/main/packages/siwx-core/src/types.ts#L214)

`true` when the message is valid and the signature matches its `address`.

#### Inherited from

[`SiwxVerifyResult`](/packages/siwx-core/interfaces/SiwxVerifyResult.md).[`success`](/packages/siwx-core/interfaces/SiwxVerifyResult.md#success)
