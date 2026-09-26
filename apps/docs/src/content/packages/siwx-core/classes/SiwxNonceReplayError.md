# SiwxNonceReplayError

Defined in: [errors.ts:95](https://github.com/TuwaIO/siwx/blob/main/packages/siwx-core/src/errors.ts#L95)

Signals that the message nonce has already been used. Code: `SIWX_NONCE_REPLAY`.

`verifySiwxPayload` (`@tuwaio/siwx-server`) raises it internally when the nonce is in `usedNonces` and returns
its message in the result.

## Extends

- [`SiwxError`](/packages/siwx-core/classes/SiwxError.md)

## Constructors

### Constructor

> **new SiwxNonceReplayError**(`nonce`): `SiwxNonceReplayError`

Defined in: [errors.ts:99](https://github.com/TuwaIO/siwx/blob/main/packages/siwx-core/src/errors.ts#L99)

#### Parameters

##### nonce

`string`

The nonce that was detected as replayed.

#### Returns

`SiwxNonceReplayError`

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

### nonce

> `readonly` **nonce**: `string`

Defined in: [errors.ts:99](https://github.com/TuwaIO/siwx/blob/main/packages/siwx-core/src/errors.ts#L99)

The nonce that was detected as replayed.
