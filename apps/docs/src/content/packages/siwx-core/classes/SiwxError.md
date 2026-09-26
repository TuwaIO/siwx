# SiwxError

Defined in: [errors.ts:10](https://github.com/TuwaIO/siwx/blob/main/packages/siwx-core/src/errors.ts#L10)

Base class of every SIWX error. Extends the native `Error` with a machine-readable `code` (for example
`SIWX_PARSE_ERROR`) for programmatic handling; `name` is set to the concrete class name.

## Extends

- `Error`

## Extended by

- [`SiwxExpiredSessionError`](/packages/siwx-core/classes/SiwxExpiredSessionError.md)
- [`SiwxNonceReplayError`](/packages/siwx-core/classes/SiwxNonceReplayError.md)
- [`SiwxParseError`](/packages/siwx-core/classes/SiwxParseError.md)
- [`SiwxPolicyViolationError`](/packages/siwx-core/classes/SiwxPolicyViolationError.md)
- [`SiwxUnsupportedNamespaceError`](/packages/siwx-core/classes/SiwxUnsupportedNamespaceError.md)
- [`SiwxValidationError`](/packages/siwx-core/classes/SiwxValidationError.md)
- [`SiwxVerificationError`](/packages/siwx-core/classes/SiwxVerificationError.md)

## Constructors

### Constructor

> **new SiwxError**(`message`, `code?`): `SiwxError`

Defined in: [errors.ts:16](https://github.com/TuwaIO/siwx/blob/main/packages/siwx-core/src/errors.ts#L16)

#### Parameters

##### message

`string`

Human-readable description of the error.

##### code?

`string` = `'SIWX_ERROR'`

Machine-readable error code, for example `SIWX_PARSE_ERROR`. Each subclass passes its own code;
`SIWX_ERROR` is used only by the base class.

#### Returns

`SiwxError`

#### Overrides

`Error.constructor`

## Properties

### code

> `readonly` **code**: `string` = `'SIWX_ERROR'`

Defined in: [errors.ts:18](https://github.com/TuwaIO/siwx/blob/main/packages/siwx-core/src/errors.ts#L18)

Machine-readable error code, for example `SIWX_PARSE_ERROR`. Each subclass passes its own code;
`SIWX_ERROR` is used only by the base class.
