# SiwxDomainMismatchError

Defined in: [errors.ts:142](https://github.com/TuwaIO/siwx/blob/main/packages/siwx-core/src/errors.ts#L142)

Policy violation: the message `domain` is not one of the expected domains. Code: `SIWX_DOMAIN_MISMATCH`.
Not thrown by SIWX itself; see [SiwxPolicyViolationError](/packages/siwx-core/classes/SiwxPolicyViolationError.md).

## Extends

- [`SiwxPolicyViolationError`](/packages/siwx-core/classes/SiwxPolicyViolationError.md)

## Constructors

### Constructor

> **new SiwxDomainMismatchError**(`expected`, `received`): `SiwxDomainMismatchError`

Defined in: [errors.ts:147](https://github.com/TuwaIO/siwx/blob/main/packages/siwx-core/src/errors.ts#L147)

#### Parameters

##### expected

`string` \| `string`[]

The expected domain or domains.

##### received

`string`

The `domain` found in the message.

#### Returns

`SiwxDomainMismatchError`

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

### expected

> `readonly` **expected**: `string` \| `string`[]

Defined in: [errors.ts:148](https://github.com/TuwaIO/siwx/blob/main/packages/siwx-core/src/errors.ts#L148)

The expected domain or domains.

***

### received

> `readonly` **received**: `string`

Defined in: [errors.ts:149](https://github.com/TuwaIO/siwx/blob/main/packages/siwx-core/src/errors.ts#L149)

The `domain` found in the message.
