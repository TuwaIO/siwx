# SiwxIssuedAtStaleError

Defined in: [errors.ts:198](https://github.com/TuwaIO/siwx/blob/main/packages/siwx-core/src/errors.ts#L198)

Policy violation: the message `issuedAt` is older than the allowed maximum age. Code: `SIWX_ISSUED_AT_STALE`.
Not thrown by SIWX itself; see [SiwxPolicyViolationError](/packages/siwx-core/classes/SiwxPolicyViolationError.md).

## Extends

- [`SiwxPolicyViolationError`](/packages/siwx-core/classes/SiwxPolicyViolationError.md)

## Constructors

### Constructor

> **new SiwxIssuedAtStaleError**(`issuedAt`, `maxAgeSeconds`): `SiwxIssuedAtStaleError`

Defined in: [errors.ts:203](https://github.com/TuwaIO/siwx/blob/main/packages/siwx-core/src/errors.ts#L203)

#### Parameters

##### issuedAt

`string`

The `issuedAt` found in the message.

##### maxAgeSeconds

`number`

The allowed maximum age, in seconds.

#### Returns

`SiwxIssuedAtStaleError`

#### Overrides

[`SiwxPolicyViolationError`](/packages/siwx-core/classes/SiwxPolicyViolationError.md).[`constructor`](/packages/siwx-core/classes/SiwxPolicyViolationError.md#constructor)

## Properties

### code

> `readonly` **code**: `string` = `'SIWX_ERROR'`

Defined in: [errors.ts:18](https://github.com/TuwaIO/siwx/blob/main/packages/siwx-core/src/errors.ts#L18)

Machine-readable error code, for example `SIWX_PARSE_ERROR`. Each subclass passes its own code;
`SIWX_ERROR` is used only by the base class.

#### Inherited from

[`SiwxPolicyViolationError`](/packages/siwx-core/classes/SiwxPolicyViolationError.md).[`code`](/packages/siwx-core/classes/SiwxPolicyViolationError.md#code)

***

### issuedAt

> `readonly` **issuedAt**: `string`

Defined in: [errors.ts:204](https://github.com/TuwaIO/siwx/blob/main/packages/siwx-core/src/errors.ts#L204)

The `issuedAt` found in the message.

***

### maxAgeSeconds

> `readonly` **maxAgeSeconds**: `number`

Defined in: [errors.ts:205](https://github.com/TuwaIO/siwx/blob/main/packages/siwx-core/src/errors.ts#L205)

The allowed maximum age, in seconds.
