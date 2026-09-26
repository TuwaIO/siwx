# SiwxParseError

Defined in: [errors.ts:30](https://github.com/TuwaIO/siwx/blob/main/packages/siwx-core/src/errors.ts#L30)

Thrown by [parseMessage](/packages/siwx-core/functions/parseMessage.md) when a string is not a well-formed CAIP-122 message (wrong header, missing
blank lines or missing required fields). Code: `SIWX_PARSE_ERROR`.

## Extends

- [`SiwxError`](/packages/siwx-core/classes/SiwxError.md)

## Constructors

### Constructor

> **new SiwxParseError**(`message`): `SiwxParseError`

Defined in: [errors.ts:34](https://github.com/TuwaIO/siwx/blob/main/packages/siwx-core/src/errors.ts#L34)

#### Parameters

##### message

`string`

Human-readable description of the parse failure.

#### Returns

`SiwxParseError`

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
