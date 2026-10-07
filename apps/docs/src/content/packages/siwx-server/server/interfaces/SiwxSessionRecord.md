# SiwxSessionRecord

Defined in: [siwx-server/src/types.ts:73](https://github.com/TuwaIO/siwx/blob/main/packages/siwx-server/src/types.ts#L73)

A session stored in a [SiwxSessionStore](/packages/siwx-server/server/interfaces/SiwxSessionStore.md).

## Properties

### createdAt

> **createdAt**: `number`

Defined in: [siwx-server/src/types.ts:81](https://github.com/TuwaIO/siwx/blob/main/packages/siwx-server/src/types.ts#L81)

Timestamp in milliseconds when the session record was created.

***

### expiresAt

> **expiresAt**: `number`

Defined in: [siwx-server/src/types.ts:83](https://github.com/TuwaIO/siwx/blob/main/packages/siwx-server/src/types.ts#L83)

Timestamp in milliseconds when the session record expires.

***

### id

> **id**: `string`

Defined in: [siwx-server/src/types.ts:75](https://github.com/TuwaIO/siwx/blob/main/packages/siwx-server/src/types.ts#L75)

Opaque, unguessable session ID. It is the value of the session cookie.

***

### session

> **session**: [`SiwxSession`](/packages/siwx-server/server/interfaces/SiwxSession.md)

Defined in: [siwx-server/src/types.ts:77](https://github.com/TuwaIO/siwx/blob/main/packages/siwx-server/src/types.ts#L77)

The verified SIWX session data.

***

### subjectId?

> `optional` **subjectId?**: `string`

Defined in: [siwx-server/src/types.ts:79](https://github.com/TuwaIO/siwx/blob/main/packages/siwx-server/src/types.ts#L79)

Optional ID of your own user record (for example a database user ID), set with `bindSubject`.
