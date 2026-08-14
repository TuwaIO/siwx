[**API Reference — @tuwaio/siwx (CAIP-122 Authentication Layer)**](../../../README.md)

***

# MemorySiwxSessionStore

Defined in: [packages/siwx-server/src/server.ts:329](https://github.com/TuwaIO/siwx/blob/bbc740ccb7f405b75bd0d4e5a1bc973b1e131514/packages/siwx-server/src/server.ts#L329)

In-memory implementation of SiwxSessionStore.
STRICTLY for local development, prototyping, and unit testing.
Fails closed in production environments.

## Implements

- [`SiwxSessionStore`](../interfaces/SiwxSessionStore.md)

## Constructors

### Constructor

> **new MemorySiwxSessionStore**(`options?`): `MemorySiwxSessionStore`

Defined in: [packages/siwx-server/src/server.ts:332](https://github.com/TuwaIO/siwx/blob/bbc740ccb7f405b75bd0d4e5a1bc973b1e131514/packages/siwx-server/src/server.ts#L332)

#### Parameters

##### options?

###### allowInProduction?

`boolean`

#### Returns

`MemorySiwxSessionStore`

## Methods

### bindSubject()

> **bindSubject**(`id`, `subjectId`): `Promise`\<`boolean`\>

Defined in: [packages/siwx-server/src/server.ts:367](https://github.com/TuwaIO/siwx/blob/bbc740ccb7f405b75bd0d4e5a1bc973b1e131514/packages/siwx-server/src/server.ts#L367)

Atomically binds a user/subject identifier to the session.

#### Parameters

##### id

`string`

The session ID.

##### subjectId

`string`

The user or subject ID.

#### Returns

`Promise`\<`boolean`\>

True if binding succeeded, false if session not found.

#### Implementation of

[`SiwxSessionStore`](../interfaces/SiwxSessionStore.md).[`bindSubject`](../interfaces/SiwxSessionStore.md#bindsubject)

***

### create()

> **create**(`input`): `Promise`\<[`SiwxSessionRecord`](../interfaces/SiwxSessionRecord.md)\>

Defined in: [packages/siwx-server/src/server.ts:343](https://github.com/TuwaIO/siwx/blob/bbc740ccb7f405b75bd0d4e5a1bc973b1e131514/packages/siwx-server/src/server.ts#L343)

Creates and stores a new session record.

#### Parameters

##### input

###### session

[`SiwxSession`](../interfaces/SiwxSession.md)

The verified session data.

###### ttlSeconds

`number`

Time-to-live in seconds.

#### Returns

`Promise`\<[`SiwxSessionRecord`](../interfaces/SiwxSessionRecord.md)\>

The created session record with unique ID.

#### Implementation of

[`SiwxSessionStore`](../interfaces/SiwxSessionStore.md).[`create`](../interfaces/SiwxSessionStore.md#create)

***

### get()

> **get**(`id`): `Promise`\<[`SiwxSessionRecord`](../interfaces/SiwxSessionRecord.md) \| `null`\>

Defined in: [packages/siwx-server/src/server.ts:357](https://github.com/TuwaIO/siwx/blob/bbc740ccb7f405b75bd0d4e5a1bc973b1e131514/packages/siwx-server/src/server.ts#L357)

Retrieves a session record by its opaque ID.

#### Parameters

##### id

`string`

The session ID.

#### Returns

`Promise`\<[`SiwxSessionRecord`](../interfaces/SiwxSessionRecord.md) \| `null`\>

The session record, or null if not found or expired.

#### Implementation of

[`SiwxSessionStore`](../interfaces/SiwxSessionStore.md).[`get`](../interfaces/SiwxSessionStore.md#get)

***

### revoke()

> **revoke**(`id`): `Promise`\<`void`\>

Defined in: [packages/siwx-server/src/server.ts:374](https://github.com/TuwaIO/siwx/blob/bbc740ccb7f405b75bd0d4e5a1bc973b1e131514/packages/siwx-server/src/server.ts#L374)

Revokes and removes a session record.

#### Parameters

##### id

`string`

The session ID.

#### Returns

`Promise`\<`void`\>

#### Implementation of

[`SiwxSessionStore`](../interfaces/SiwxSessionStore.md).[`revoke`](../interfaces/SiwxSessionStore.md#revoke)
