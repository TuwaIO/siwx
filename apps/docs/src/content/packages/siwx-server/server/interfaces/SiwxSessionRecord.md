# SiwxSessionRecord

Defined in: [siwx-server/src/types.ts:94](https://github.com/TuwaIO/siwx/blob/main/packages/siwx-server/src/types.ts#L94)

A session stored in a [SiwxSessionStore](/packages/siwx-server/server/interfaces/SiwxSessionStore.md).

## Properties

### createdAt

> **createdAt**: `number`

Defined in: [siwx-server/src/types.ts:102](https://github.com/TuwaIO/siwx/blob/main/packages/siwx-server/src/types.ts#L102)

Timestamp in milliseconds when the session record was created.

***

### expiresAt

> **expiresAt**: `number`

Defined in: [siwx-server/src/types.ts:104](https://github.com/TuwaIO/siwx/blob/main/packages/siwx-server/src/types.ts#L104)

Timestamp in milliseconds when the session record expires.

***

### id

> **id**: `string`

Defined in: [siwx-server/src/types.ts:96](https://github.com/TuwaIO/siwx/blob/main/packages/siwx-server/src/types.ts#L96)

Opaque, unguessable session ID. It is the value of the session cookie.

***

### session

> **session**: [`SiwxSession`](/packages/siwx-server/server/interfaces/SiwxSession.md)

Defined in: [siwx-server/src/types.ts:98](https://github.com/TuwaIO/siwx/blob/main/packages/siwx-server/src/types.ts#L98)

The verified SIWX session data.

***

### subjectId?

> `optional` **subjectId?**: `string`

Defined in: [siwx-server/src/types.ts:100](https://github.com/TuwaIO/siwx/blob/main/packages/siwx-server/src/types.ts#L100)

Optional ID of your own user record (for example a database user ID), set with `bindSubject`.
