[**API Reference — @tuwaio/siwx (CAIP-122 Authentication Layer)**](../../../README.md)

***

# SiwxSessionRecord

Defined in: [packages/siwx-server/src/types.ts:70](https://github.com/TuwaIO/siwx/blob/bbc740ccb7f405b75bd0d4e5a1bc973b1e131514/packages/siwx-server/src/types.ts#L70)

Represents a stored session record in a durable session store.

## Properties

### createdAt

> **createdAt**: `number`

Defined in: [packages/siwx-server/src/types.ts:78](https://github.com/TuwaIO/siwx/blob/bbc740ccb7f405b75bd0d4e5a1bc973b1e131514/packages/siwx-server/src/types.ts#L78)

Timestamp in milliseconds when the session record was created.

***

### expiresAt

> **expiresAt**: `number`

Defined in: [packages/siwx-server/src/types.ts:80](https://github.com/TuwaIO/siwx/blob/bbc740ccb7f405b75bd0d4e5a1bc973b1e131514/packages/siwx-server/src/types.ts#L80)

Timestamp in milliseconds when the session record expires.

***

### id

> **id**: `string`

Defined in: [packages/siwx-server/src/types.ts:72](https://github.com/TuwaIO/siwx/blob/bbc740ccb7f405b75bd0d4e5a1bc973b1e131514/packages/siwx-server/src/types.ts#L72)

Unique opaque session identifier (e.g. secure random UUID).

***

### session

> **session**: [`SiwxSession`](SiwxSession.md)

Defined in: [packages/siwx-server/src/types.ts:74](https://github.com/TuwaIO/siwx/blob/bbc740ccb7f405b75bd0d4e5a1bc973b1e131514/packages/siwx-server/src/types.ts#L74)

The verified SIWX session data.

***

### subjectId?

> `optional` **subjectId?**: `string`

Defined in: [packages/siwx-server/src/types.ts:76](https://github.com/TuwaIO/siwx/blob/bbc740ccb7f405b75bd0d4e5a1bc973b1e131514/packages/siwx-server/src/types.ts#L76)

Optional subject ID (e.g., Payload User ID or internal database ID) bound to this session.
