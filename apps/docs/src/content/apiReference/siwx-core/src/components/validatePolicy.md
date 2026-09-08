[**API Reference — @tuwaio/siwx (CAIP-122 Authentication Layer)**](../../../README.md)

***

# validatePolicy()

> **validatePolicy**(`fields`, `policy?`, `now?`): `string`[]

Defined in: [packages/siwx-core/src/validateMessage.ts:136](https://github.com/TuwaIO/siwx/blob/f77d0e06aaa7919c3688c2277c2d9f28269ea2b6/packages/siwx-core/src/validateMessage.ts#L136)

Validates a CAIP-122 message object against an optional verification policy.

## Parameters

### fields

[`SiwxMessageFields`](../interfaces/SiwxMessageFields.md)

The message fields to validate.

### policy?

[`SiwxVerificationPolicy`](../interfaces/SiwxVerificationPolicy.md)

The verification policy to enforce.

### now?

`Date` = `...`

Reference date for timestamp validations (defaults to new Date()).

## Returns

`string`[]

An array of policy violation error messages.
