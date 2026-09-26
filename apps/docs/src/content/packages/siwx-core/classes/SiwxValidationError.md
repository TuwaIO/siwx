# SiwxValidationError

Defined in: [errors.ts:47](https://github.com/TuwaIO/siwx/blob/main/packages/siwx-core/src/errors.ts#L47)

Signals that one or more message fields failed validation; `errors` lists every failure.
Code: `SIWX_VALIDATION_ERROR`.

The chain verifiers (`verifyEip191`, `verifyEip1271`, `verifyEd25519`) raise it internally and return its
message in `SiwxVerifyResult.error`. [validateMessage](/packages/siwx-core/functions/validateMessage.md) returns a result instead of throwing it.

## Extends

- [`SiwxError`](/packages/siwx-core/classes/SiwxError.md)

## Constructors

### Constructor

> **new SiwxValidationError**(`errors`): `SiwxValidationError`

Defined in: [errors.ts:51](https://github.com/TuwaIO/siwx/blob/main/packages/siwx-core/src/errors.ts#L51)

#### Parameters

##### errors

`string`[]

Descriptions of the failed checks, as returned by [validateMessage](/packages/siwx-core/functions/validateMessage.md).

#### Returns

`SiwxValidationError`

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

***

### errors

> `readonly` **errors**: `string`[]

Defined in: [errors.ts:51](https://github.com/TuwaIO/siwx/blob/main/packages/siwx-core/src/errors.ts#L51)

Descriptions of the failed checks, as returned by [validateMessage](/packages/siwx-core/functions/validateMessage.md).
