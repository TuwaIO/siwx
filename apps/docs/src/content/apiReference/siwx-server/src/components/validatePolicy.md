[**API Reference — @tuwaio/siwx (CAIP-122 Authentication Layer)**](../../../README.md)

***

# validatePolicy()

> **validatePolicy**(`fields`, `policy?`, `now?`): `string`[]

Defined in: packages/siwx-core/dist/index.d.ts:401

Validates a CAIP-122 message object against an optional verification policy.

## Parameters

### fields

[`SiwxMessageFields`](../../../siwx-react/src/interfaces/SiwxMessageFields.md)

The message fields to validate.

### policy?

[`SiwxVerificationPolicy`](../interfaces/SiwxVerificationPolicy.md)

The verification policy to enforce.

### now?

`Date`

Reference date for timestamp validations (defaults to new Date()).

## Returns

`string`[]

An array of policy violation error messages.
