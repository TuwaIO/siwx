[**API Reference — @tuwaio/siwx (CAIP-122 Authentication Layer)**](../../../README.md)

***

# validatePolicy()

> **validatePolicy**(`fields`, `policy?`, `now?`): `string`[]

Defined in: [packages/siwx-core/src/validateMessage.ts:136](https://github.com/TuwaIO/siwx/blob/7a4dd6dae3d09a536e9c8ec7c5ea5bf16941b2e9/packages/siwx-core/src/validateMessage.ts#L136)

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
