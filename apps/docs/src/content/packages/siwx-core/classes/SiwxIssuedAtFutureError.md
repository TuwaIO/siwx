# SiwxIssuedAtFutureError

Defined in: [errors.ts:219](https://github.com/TuwaIO/siwx/blob/main/packages/siwx-core/src/errors.ts#L219)

Policy violation: the message `issuedAt` lies in the future beyond the allowed clock skew.
Code: `SIWX_ISSUED_AT_FUTURE`. Not thrown by SIWX itself; see [SiwxPolicyViolationError](/packages/siwx-core/classes/SiwxPolicyViolationError.md).

## Extends

- [`SiwxPolicyViolationError`](/packages/siwx-core/classes/SiwxPolicyViolationError.md)

## Constructors

### Constructor

> **new SiwxIssuedAtFutureError**(`issuedAt`, `clockSkewSeconds`): `SiwxIssuedAtFutureError`

Defined in: [errors.ts:224](https://github.com/TuwaIO/siwx/blob/main/packages/siwx-core/src/errors.ts#L224)

#### Parameters

##### issuedAt

`string`

The `issuedAt` found in the message.

##### clockSkewSeconds

`number`

The allowed clock skew, in seconds.

#### Returns

`SiwxIssuedAtFutureError`

#### Overrides

[`SiwxPolicyViolationError`](/packages/siwx-core/classes/SiwxPolicyViolationError.md).[`constructor`](/packages/siwx-core/classes/SiwxPolicyViolationError.md#constructor)

## Properties

### clockSkewSeconds

> `readonly` **clockSkewSeconds**: `number`

Defined in: [errors.ts:226](https://github.com/TuwaIO/siwx/blob/main/packages/siwx-core/src/errors.ts#L226)

The allowed clock skew, in seconds.

***

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

Defined in: [errors.ts:225](https://github.com/TuwaIO/siwx/blob/main/packages/siwx-core/src/errors.ts#L225)

The `issuedAt` found in the message.
