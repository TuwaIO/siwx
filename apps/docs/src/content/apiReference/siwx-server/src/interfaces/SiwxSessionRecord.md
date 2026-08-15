[**API Reference — @tuwaio/siwx (CAIP-122 Authentication Layer)**](../../../README.md)

***

# SiwxSessionRecord

Defined in: [packages/siwx-server/src/types.ts:70](https://github.com/TuwaIO/siwx/blob/0ca0708dd74b07eb7d1d46e0b3ebb6c65b68bbc8/packages/siwx-server/src/types.ts#L70)

Represents a stored session record in a durable session store.

## Properties

### createdAt

> **createdAt**: `number`

Defined in: [packages/siwx-server/src/types.ts:78](https://github.com/TuwaIO/siwx/blob/0ca0708dd74b07eb7d1d46e0b3ebb6c65b68bbc8/packages/siwx-server/src/types.ts#L78)

Timestamp in milliseconds when the session record was created.

***

### expiresAt

> **expiresAt**: `number`

Defined in: [packages/siwx-server/src/types.ts:80](https://github.com/TuwaIO/siwx/blob/0ca0708dd74b07eb7d1d46e0b3ebb6c65b68bbc8/packages/siwx-server/src/types.ts#L80)

Timestamp in milliseconds when the session record expires.

***

### id

> **id**: `string`

Defined in: [packages/siwx-server/src/types.ts:72](https://github.com/TuwaIO/siwx/blob/0ca0708dd74b07eb7d1d46e0b3ebb6c65b68bbc8/packages/siwx-server/src/types.ts#L72)

Unique opaque session identifier (e.g. secure random UUID).

***

### session

> **session**: [`SiwxSession`](SiwxSession.md)

Defined in: [packages/siwx-server/src/types.ts:74](https://github.com/TuwaIO/siwx/blob/0ca0708dd74b07eb7d1d46e0b3ebb6c65b68bbc8/packages/siwx-server/src/types.ts#L74)

The verified SIWX session data.

***

### subjectId?

> `optional` **subjectId?**: `string`

Defined in: [packages/siwx-server/src/types.ts:76](https://github.com/TuwaIO/siwx/blob/0ca0708dd74b07eb7d1d46e0b3ebb6c65b68bbc8/packages/siwx-server/src/types.ts#L76)

Optional subject ID (e.g., Payload User ID or internal database ID) bound to this session.
