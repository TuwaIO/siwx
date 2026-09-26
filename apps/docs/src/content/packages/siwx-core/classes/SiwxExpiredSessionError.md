# SiwxExpiredSessionError

Defined in: [errors.ts:79](https://github.com/TuwaIO/siwx/blob/main/packages/siwx-core/src/errors.ts#L79)

Signals that the message `expirationTime` has passed. Code: `SIWX_EXPIRED_SESSION`.

Not thrown by SIWX itself: expired messages are reported by [validateMessage](/packages/siwx-core/functions/validateMessage.md) and returned as `error` by the
verifiers. Provided for applications that want to throw a typed error from their own checks.

## Extends

- [`SiwxError`](/packages/siwx-core/classes/SiwxError.md)

## Constructors

### Constructor

> **new SiwxExpiredSessionError**(`expirationTime`): `SiwxExpiredSessionError`

Defined in: [errors.ts:83](https://github.com/TuwaIO/siwx/blob/main/packages/siwx-core/src/errors.ts#L83)

#### Parameters

##### expirationTime

`string`

The ISO 8601 timestamp when the session expired.

#### Returns

`SiwxExpiredSessionError`

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

### expirationTime

> `readonly` **expirationTime**: `string`

Defined in: [errors.ts:83](https://github.com/TuwaIO/siwx/blob/main/packages/siwx-core/src/errors.ts#L83)

The ISO 8601 timestamp when the session expired.
