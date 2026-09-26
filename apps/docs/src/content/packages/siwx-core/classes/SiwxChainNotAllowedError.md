# SiwxChainNotAllowedError

Defined in: [errors.ts:180](https://github.com/TuwaIO/siwx/blob/main/packages/siwx-core/src/errors.ts#L180)

Policy violation: the message `chainId` is not in the allowed list. Code: `SIWX_CHAIN_NOT_ALLOWED`.
Not thrown by SIWX itself; see [SiwxPolicyViolationError](/packages/siwx-core/classes/SiwxPolicyViolationError.md).

## Extends

- [`SiwxPolicyViolationError`](/packages/siwx-core/classes/SiwxPolicyViolationError.md)

## Constructors

### Constructor

> **new SiwxChainNotAllowedError**(`allowedChainIds`, `received`): `SiwxChainNotAllowedError`

Defined in: [errors.ts:185](https://github.com/TuwaIO/siwx/blob/main/packages/siwx-core/src/errors.ts#L185)

#### Parameters

##### allowedChainIds

`string`[]

The allowed CAIP-2 chain IDs.

##### received

`string`

The `chainId` found in the message.

#### Returns

`SiwxChainNotAllowedError`

#### Overrides

[`SiwxPolicyViolationError`](/packages/siwx-core/classes/SiwxPolicyViolationError.md).[`constructor`](/packages/siwx-core/classes/SiwxPolicyViolationError.md#constructor)

## Properties

### allowedChainIds

> `readonly` **allowedChainIds**: `string`[]

Defined in: [errors.ts:186](https://github.com/TuwaIO/siwx/blob/main/packages/siwx-core/src/errors.ts#L186)

The allowed CAIP-2 chain IDs.

***

### code

> `readonly` **code**: `string` = `'SIWX_ERROR'`

Defined in: [errors.ts:18](https://github.com/TuwaIO/siwx/blob/main/packages/siwx-core/src/errors.ts#L18)

Machine-readable error code, for example `SIWX_PARSE_ERROR`. Each subclass passes its own code;
`SIWX_ERROR` is used only by the base class.

#### Inherited from

[`SiwxPolicyViolationError`](/packages/siwx-core/classes/SiwxPolicyViolationError.md).[`code`](/packages/siwx-core/classes/SiwxPolicyViolationError.md#code)

***

### received

> `readonly` **received**: `string`

Defined in: [errors.ts:187](https://github.com/TuwaIO/siwx/blob/main/packages/siwx-core/src/errors.ts#L187)

The `chainId` found in the message.
