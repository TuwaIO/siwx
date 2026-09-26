# SiwxPolicyViolationError

Defined in: [errors.ts:127](https://github.com/TuwaIO/siwx/blob/main/packages/siwx-core/src/errors.ts#L127)

Base class of the policy violation errors. Code: `SIWX_POLICY_VIOLATION`, or a specific code set by a subclass.

The SIWX functions report policy violations as strings (see [validatePolicy](/packages/siwx-core/functions/validatePolicy.md)) and never throw this class or
its subclasses. They are provided for applications that want to throw typed errors from their own checks.

## Extends

- [`SiwxError`](/packages/siwx-core/classes/SiwxError.md)

## Extended by

- [`SiwxChainNotAllowedError`](/packages/siwx-core/classes/SiwxChainNotAllowedError.md)
- [`SiwxDomainMismatchError`](/packages/siwx-core/classes/SiwxDomainMismatchError.md)
- [`SiwxIssuedAtFutureError`](/packages/siwx-core/classes/SiwxIssuedAtFutureError.md)
- [`SiwxIssuedAtStaleError`](/packages/siwx-core/classes/SiwxIssuedAtStaleError.md)
- [`SiwxNotBeforeError`](/packages/siwx-core/classes/SiwxNotBeforeError.md)
- [`SiwxSessionLifetimeExceededError`](/packages/siwx-core/classes/SiwxSessionLifetimeExceededError.md)
- [`SiwxUriMismatchError`](/packages/siwx-core/classes/SiwxUriMismatchError.md)

## Constructors

### Constructor

> **new SiwxPolicyViolationError**(`message`, `code?`): `SiwxPolicyViolationError`

Defined in: [errors.ts:132](https://github.com/TuwaIO/siwx/blob/main/packages/siwx-core/src/errors.ts#L132)

#### Parameters

##### message

`string`

Human-readable description of the violation.

##### code?

`string` = `'SIWX_POLICY_VIOLATION'`

Machine-readable error code. Defaults to `SIWX_POLICY_VIOLATION`.

#### Returns

`SiwxPolicyViolationError`

#### Overrides

[`SiwxError`](/packages/siwx-core/classes/SiwxError.md).[`constructor`](/packages/siwx-core/classes/SiwxError.md#constructor)

## Properties

### code

> `readonly` **code**: `string` = `'SIWX_ERROR'`

Defined in: [errors.ts:18](https://github.com/TuwaIO/siwx/blob/main/packages/siwx-core/src/errors.ts#L18)

Machine-readable error code, for example `SIWX_PARSE_ERROR`. Each subclass passes its own code;
`SIWX_ERROR` is used only by the base class.

#### Inherited from

[`SiwxError`](/packages/siwx-core/classes/SiwxError.md).[`code`](/packages/siwx-core/classes/SiwxError.md#code)
