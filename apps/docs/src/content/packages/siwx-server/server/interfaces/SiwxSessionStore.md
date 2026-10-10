# SiwxSessionStore

Defined in: [siwx-server/src/types.ts:112](https://github.com/TuwaIO/siwx/blob/main/packages/siwx-server/src/types.ts#L112)

Storage contract for durable sessions (Redis, SQL, KV…), used by `createSiwxApiHandler` and
[getSiwxServerSession](/packages/siwx-server/server/functions/getSiwxServerSession.md). Implementations must be shared by every server instance.
[MemorySiwxSessionStore](/packages/siwx-server/server/classes/MemorySiwxSessionStore.md) is an in-memory implementation for development and tests.

## Methods

### bindSubject()

> **bindSubject**(`id`, `subjectId`): `Promise`\<`boolean`\>

Defined in: [siwx-server/src/types.ts:136](https://github.com/TuwaIO/siwx/blob/main/packages/siwx-server/src/types.ts#L136)

Binds one of your user IDs to the session. Not called by SIWX; use it after sign-in to link the wallet session to
your own user record.

#### Parameters

##### id

`string`

The session ID.

##### subjectId

`string`

The user or subject ID.

#### Returns

`Promise`\<`boolean`\>

`true` if the session exists and was updated, `false` otherwise.

***

### create()

> **create**(`input`): `Promise`\<[`SiwxSessionRecord`](/packages/siwx-server/server/interfaces/SiwxSessionRecord.md)\>

Defined in: [siwx-server/src/types.ts:120](https://github.com/TuwaIO/siwx/blob/main/packages/siwx-server/src/types.ts#L120)

Creates and stores a new session record.

#### Parameters

##### input

The session to store.

###### session

[`SiwxSession`](/packages/siwx-server/server/interfaces/SiwxSession.md)

The verified session data.

###### ttlSeconds

`number`

Time-to-live in seconds.

#### Returns

`Promise`\<[`SiwxSessionRecord`](/packages/siwx-server/server/interfaces/SiwxSessionRecord.md)\>

The created record. Its `id` must be unguessable, because it becomes the session cookie value.

***

### get()

> **get**(`id`): `Promise`\<[`SiwxSessionRecord`](/packages/siwx-server/server/interfaces/SiwxSessionRecord.md) \| `null`\>

Defined in: [siwx-server/src/types.ts:127](https://github.com/TuwaIO/siwx/blob/main/packages/siwx-server/src/types.ts#L127)

Retrieves a session record by its ID. Session expiry is enforced here: SIWX does not compare `expiresAt` itself.

#### Parameters

##### id

`string`

The session ID.

#### Returns

`Promise`\<[`SiwxSessionRecord`](/packages/siwx-server/server/interfaces/SiwxSessionRecord.md) \| `null`\>

The session record, or `null` if it does not exist or has expired.

***

### revoke()

> **revoke**(`id`): `Promise`\<`void`\>

Defined in: [siwx-server/src/types.ts:143](https://github.com/TuwaIO/siwx/blob/main/packages/siwx-server/src/types.ts#L143)

Revokes a session. Must succeed when the session does not exist.

#### Parameters

##### id

`string`

The session ID.

#### Returns

`Promise`\<`void`\>

A promise that resolves once the session is removed.
