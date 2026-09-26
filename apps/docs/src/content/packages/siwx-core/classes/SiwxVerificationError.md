# SiwxVerificationError

Defined in: [errors.ts:63](https://github.com/TuwaIO/siwx/blob/main/packages/siwx-core/src/errors.ts#L63)

Signals a failed signature check: the signature is invalid, the message was altered, or the signer does not
match the message `address`. Code: `SIWX_VERIFICATION_ERROR`.

The chain verifiers raise it internally and return its message in `SiwxVerifyResult.error`.

## Extends

- [`SiwxError`](/packages/siwx-core/classes/SiwxError.md)

## Constructors

### Constructor

> **new SiwxVerificationError**(`message`): `SiwxVerificationError`

Defined in: [errors.ts:67](https://github.com/TuwaIO/siwx/blob/main/packages/siwx-core/src/errors.ts#L67)

#### Parameters

##### message

`string`

Human-readable description of the verification failure.

#### Returns

`SiwxVerificationError`

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
