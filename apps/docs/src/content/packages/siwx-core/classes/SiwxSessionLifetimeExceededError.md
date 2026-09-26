# SiwxSessionLifetimeExceededError

Defined in: [errors.ts:254](https://github.com/TuwaIO/siwx/blob/main/packages/siwx-core/src/errors.ts#L254)

Policy violation: `expirationTime - issuedAt` exceeds the allowed maximum lifetime.
Code: `SIWX_SESSION_LIFETIME_EXCEEDED`. Not thrown by SIWX itself; see [SiwxPolicyViolationError](/packages/siwx-core/classes/SiwxPolicyViolationError.md).

## Extends

- [`SiwxPolicyViolationError`](/packages/siwx-core/classes/SiwxPolicyViolationError.md)

## Constructors

### Constructor

> **new SiwxSessionLifetimeExceededError**(`lifetimeSeconds`, `maxLifetimeSeconds`): `SiwxSessionLifetimeExceededError`

Defined in: [errors.ts:259](https://github.com/TuwaIO/siwx/blob/main/packages/siwx-core/src/errors.ts#L259)

#### Parameters

##### lifetimeSeconds

`number`

The lifetime of the message, in seconds.

##### maxLifetimeSeconds

`number`

The allowed maximum lifetime, in seconds.

#### Returns

`SiwxSessionLifetimeExceededError`

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

### lifetimeSeconds

> `readonly` **lifetimeSeconds**: `number`

Defined in: [errors.ts:260](https://github.com/TuwaIO/siwx/blob/main/packages/siwx-core/src/errors.ts#L260)

The lifetime of the message, in seconds.

***

### maxLifetimeSeconds

> `readonly` **maxLifetimeSeconds**: `number`

Defined in: [errors.ts:261](https://github.com/TuwaIO/siwx/blob/main/packages/siwx-core/src/errors.ts#L261)

The allowed maximum lifetime, in seconds.
