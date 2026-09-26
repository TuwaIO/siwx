# SiwxUnsupportedNamespaceError

Defined in: [errors.ts:111](https://github.com/TuwaIO/siwx/blob/main/packages/siwx-core/src/errors.ts#L111)

Signals a CAIP-2 namespace that is not supported (anything other than `eip155` and `solana`), or not supported
by the verifier that received the message. Code: `SIWX_UNSUPPORTED_NAMESPACE`.

The chain verifiers and `verifySiwxPayload` raise it internally and report it through their result.

## Extends

- [`SiwxError`](/packages/siwx-core/classes/SiwxError.md)

## Constructors

### Constructor

> **new SiwxUnsupportedNamespaceError**(`namespace`): `SiwxUnsupportedNamespaceError`

Defined in: [errors.ts:115](https://github.com/TuwaIO/siwx/blob/main/packages/siwx-core/src/errors.ts#L115)

#### Parameters

##### namespace

`string`

The namespace extracted from the message `chainId`.

#### Returns

`SiwxUnsupportedNamespaceError`

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

### namespace

> `readonly` **namespace**: `string`

Defined in: [errors.ts:115](https://github.com/TuwaIO/siwx/blob/main/packages/siwx-core/src/errors.ts#L115)

The namespace extracted from the message `chainId`.
