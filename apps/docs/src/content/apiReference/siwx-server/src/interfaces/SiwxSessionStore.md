[**API Reference — @tuwaio/siwx (CAIP-122 Authentication Layer)**](../../../README.md)

***

# SiwxSessionStore

Defined in: [packages/siwx-server/src/types.ts:86](https://github.com/TuwaIO/siwx/blob/3e92d2c12c74ad4820f3f675f56b978c23099c12/packages/siwx-server/src/types.ts#L86)

Durable session store interface for production environments.

## Methods

### bindSubject()

> **bindSubject**(`id`, `subjectId`): `Promise`\<`boolean`\>

Defined in: [packages/siwx-server/src/types.ts:108](https://github.com/TuwaIO/siwx/blob/3e92d2c12c74ad4820f3f675f56b978c23099c12/packages/siwx-server/src/types.ts#L108)

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

***

### create()

> **create**(`input`): `Promise`\<[`SiwxSessionRecord`](SiwxSessionRecord.md)\>

Defined in: [packages/siwx-server/src/types.ts:93](https://github.com/TuwaIO/siwx/blob/3e92d2c12c74ad4820f3f675f56b978c23099c12/packages/siwx-server/src/types.ts#L93)

Creates and stores a new session record.

#### Parameters

##### input

###### session

[`SiwxSession`](SiwxSession.md)

The verified session data.

###### ttlSeconds

`number`

Time-to-live in seconds.

#### Returns

`Promise`\<[`SiwxSessionRecord`](SiwxSessionRecord.md)\>

The created session record with unique ID.

***

### get()

> **get**(`id`): `Promise`\<[`SiwxSessionRecord`](SiwxSessionRecord.md) \| `null`\>

Defined in: [packages/siwx-server/src/types.ts:100](https://github.com/TuwaIO/siwx/blob/3e92d2c12c74ad4820f3f675f56b978c23099c12/packages/siwx-server/src/types.ts#L100)

Retrieves a session record by its opaque ID.

#### Parameters

##### id

`string`

The session ID.

#### Returns

`Promise`\<[`SiwxSessionRecord`](SiwxSessionRecord.md) \| `null`\>

The session record, or null if not found or expired.

***

### revoke()

> **revoke**(`id`): `Promise`\<`void`\>

Defined in: [packages/siwx-server/src/types.ts:114](https://github.com/TuwaIO/siwx/blob/3e92d2c12c74ad4820f3f675f56b978c23099c12/packages/siwx-server/src/types.ts#L114)

Revokes and removes a session record.

#### Parameters

##### id

`string`

The session ID.

#### Returns

`Promise`\<`void`\>
