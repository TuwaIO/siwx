[**API Reference — @tuwaio/siwx (CAIP-122 Authentication Layer)**](../../../README.md)

***

# SiwxVerifyResult

Defined in: [packages/siwx-core/src/types.ts:195](https://github.com/TuwaIO/siwx/blob/fcaa3a6f9f1375901c6bae0f335f995349246d8e/packages/siwx-core/src/types.ts#L195)

The result of a signature verification operation.

## Properties

### data?

> `optional` **data?**: [`SiwxMessageFields`](SiwxMessageFields.md)

Defined in: [packages/siwx-core/src/types.ts:202](https://github.com/TuwaIO/siwx/blob/fcaa3a6f9f1375901c6bae0f335f995349246d8e/packages/siwx-core/src/types.ts#L202)

The parsed message fields if verification succeeded.
Present only when `success` is true.

***

### error?

> `optional` **error?**: `string`

Defined in: [packages/siwx-core/src/types.ts:207](https://github.com/TuwaIO/siwx/blob/fcaa3a6f9f1375901c6bae0f335f995349246d8e/packages/siwx-core/src/types.ts#L207)

A human-readable error if verification failed.
Present only when `success` is false.

***

### success

> **success**: `boolean`

Defined in: [packages/siwx-core/src/types.ts:197](https://github.com/TuwaIO/siwx/blob/fcaa3a6f9f1375901c6bae0f335f995349246d8e/packages/siwx-core/src/types.ts#L197)

Whether the signature is valid and the message is authentic.
