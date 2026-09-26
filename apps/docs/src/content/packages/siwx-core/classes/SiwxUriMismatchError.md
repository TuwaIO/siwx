# SiwxUriMismatchError

Defined in: [errors.ts:161](https://github.com/TuwaIO/siwx/blob/main/packages/siwx-core/src/errors.ts#L161)

Policy violation: the message `uri` does not match the expected URIs. Code: `SIWX_URI_MISMATCH`.
Not thrown by SIWX itself; see [SiwxPolicyViolationError](/packages/siwx-core/classes/SiwxPolicyViolationError.md).

## Extends

- [`SiwxPolicyViolationError`](/packages/siwx-core/classes/SiwxPolicyViolationError.md)

## Constructors

### Constructor

> **new SiwxUriMismatchError**(`expected`, `received`): `SiwxUriMismatchError`

Defined in: [errors.ts:166](https://github.com/TuwaIO/siwx/blob/main/packages/siwx-core/src/errors.ts#L166)

#### Parameters

##### expected

`string` \| `string`[]

The expected URI or URIs.

##### received

`string`

The `uri` found in the message.

#### Returns

`SiwxUriMismatchError`

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

### expected

> `readonly` **expected**: `string` \| `string`[]

Defined in: [errors.ts:167](https://github.com/TuwaIO/siwx/blob/main/packages/siwx-core/src/errors.ts#L167)

The expected URI or URIs.

***

### received

> `readonly` **received**: `string`

Defined in: [errors.ts:168](https://github.com/TuwaIO/siwx/blob/main/packages/siwx-core/src/errors.ts#L168)

The `uri` found in the message.
