# SiwxNotBeforeError

Defined in: [errors.ts:240](https://github.com/TuwaIO/siwx/blob/main/packages/siwx-core/src/errors.ts#L240)

Policy violation: the message `notBefore` has not been reached yet. Code: `SIWX_NOT_BEFORE`.
Not thrown by SIWX itself; see [SiwxPolicyViolationError](/packages/siwx-core/classes/SiwxPolicyViolationError.md).

## Extends

- [`SiwxPolicyViolationError`](/packages/siwx-core/classes/SiwxPolicyViolationError.md)

## Constructors

### Constructor

> **new SiwxNotBeforeError**(`notBefore`): `SiwxNotBeforeError`

Defined in: [errors.ts:244](https://github.com/TuwaIO/siwx/blob/main/packages/siwx-core/src/errors.ts#L244)

#### Parameters

##### notBefore

`string`

The `notBefore` found in the message.

#### Returns

`SiwxNotBeforeError`

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

### notBefore

> `readonly` **notBefore**: `string`

Defined in: [errors.ts:244](https://github.com/TuwaIO/siwx/blob/main/packages/siwx-core/src/errors.ts#L244)

The `notBefore` found in the message.
