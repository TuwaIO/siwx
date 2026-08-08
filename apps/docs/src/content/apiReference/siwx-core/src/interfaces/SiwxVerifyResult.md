[**API Reference — @tuwaio/siwx (CAIP-122 Authentication Layer)**](../../../README.md)

***

# SiwxVerifyResult

Defined in: [packages/siwx-core/src/types.ts:128](https://github.com/TuwaIO/siwx/blob/937790ab6674ad6603e43d2020db35b698d6f5b0/packages/siwx-core/src/types.ts#L128)

The result of a signature verification operation.

## Properties

### data?

> `optional` **data?**: [`SiwxMessageFields`](SiwxMessageFields.md)

Defined in: [packages/siwx-core/src/types.ts:135](https://github.com/TuwaIO/siwx/blob/937790ab6674ad6603e43d2020db35b698d6f5b0/packages/siwx-core/src/types.ts#L135)

The parsed message fields if verification succeeded.
Present only when `success` is true.

***

### error?

> `optional` **error?**: `string`

Defined in: [packages/siwx-core/src/types.ts:140](https://github.com/TuwaIO/siwx/blob/937790ab6674ad6603e43d2020db35b698d6f5b0/packages/siwx-core/src/types.ts#L140)

A human-readable error if verification failed.
Present only when `success` is false.

***

### success

> **success**: `boolean`

Defined in: [packages/siwx-core/src/types.ts:130](https://github.com/TuwaIO/siwx/blob/937790ab6674ad6603e43d2020db35b698d6f5b0/packages/siwx-core/src/types.ts#L130)

Whether the signature is valid and the message is authentic.
