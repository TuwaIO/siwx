# MemorySiwxSessionStore

Defined in: [siwx-server/src/server.ts:399](https://github.com/TuwaIO/siwx/blob/main/packages/siwx-server/src/server.ts#L399)

In-memory [SiwxSessionStore](/packages/siwx-server/server/interfaces/SiwxSessionStore.md) for local development and tests. Sessions live in a `Map` of the current
process: they are lost on restart and not shared between instances or serverless invocations. Session IDs are
32-character hex strings from [generateNonce](/packages/siwx-server/server/functions/generateServerNonce.md).

## Implements

- [`SiwxSessionStore`](/packages/siwx-server/server/interfaces/SiwxSessionStore.md)

## Constructors

### Constructor

> **new MemorySiwxSessionStore**(`options?`): `MemorySiwxSessionStore`

Defined in: [siwx-server/src/server.ts:407](https://github.com/TuwaIO/siwx/blob/main/packages/siwx-server/src/server.ts#L407)

#### Parameters

##### options?

Store options.

###### allowInProduction?

`boolean`

Allows the store when `NODE_ENV` is `production`.

#### Returns

`MemorySiwxSessionStore`

#### Throws

When `process.env.NODE_ENV` is `production` and `allowInProduction` is not `true`.

## Methods

### bindSubject()

> **bindSubject**(`id`, `subjectId`): `Promise`\<`boolean`\>

Defined in: [siwx-server/src/server.ts:442](https://github.com/TuwaIO/siwx/blob/main/packages/siwx-server/src/server.ts#L442)

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

#### Implementation of

[`SiwxSessionStore`](/packages/siwx-server/server/interfaces/SiwxSessionStore.md).[`bindSubject`](/packages/siwx-server/server/interfaces/SiwxSessionStore.md#bindsubject)

***

### create()

> **create**(`input`): `Promise`\<[`SiwxSessionRecord`](/packages/siwx-server/server/interfaces/SiwxSessionRecord.md)\>

Defined in: [siwx-server/src/server.ts:418](https://github.com/TuwaIO/siwx/blob/main/packages/siwx-server/src/server.ts#L418)

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

#### Implementation of

[`SiwxSessionStore`](/packages/siwx-server/server/interfaces/SiwxSessionStore.md).[`create`](/packages/siwx-server/server/interfaces/SiwxSessionStore.md#create)

***

### get()

> **get**(`id`): `Promise`\<[`SiwxSessionRecord`](/packages/siwx-server/server/interfaces/SiwxSessionRecord.md) \| `null`\>

Defined in: [siwx-server/src/server.ts:432](https://github.com/TuwaIO/siwx/blob/main/packages/siwx-server/src/server.ts#L432)

Retrieves a session record by its ID. Session expiry is enforced here: SIWX does not compare `expiresAt` itself.

#### Parameters

##### id

`string`

The session ID.

#### Returns

`Promise`\<[`SiwxSessionRecord`](/packages/siwx-server/server/interfaces/SiwxSessionRecord.md) \| `null`\>

The session record, or `null` if it does not exist or has expired.

#### Implementation of

[`SiwxSessionStore`](/packages/siwx-server/server/interfaces/SiwxSessionStore.md).[`get`](/packages/siwx-server/server/interfaces/SiwxSessionStore.md#get)

***

### revoke()

> **revoke**(`id`): `Promise`\<`void`\>

Defined in: [siwx-server/src/server.ts:449](https://github.com/TuwaIO/siwx/blob/main/packages/siwx-server/src/server.ts#L449)

Revokes a session. Must succeed when the session does not exist.

#### Parameters

##### id

`string`

The session ID.

#### Returns

`Promise`\<`void`\>

A promise that resolves once the session is removed.

#### Implementation of

[`SiwxSessionStore`](/packages/siwx-server/server/interfaces/SiwxSessionStore.md).[`revoke`](/packages/siwx-server/server/interfaces/SiwxSessionStore.md#revoke)
