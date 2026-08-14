[**API Reference — @tuwaio/siwx (CAIP-122 Authentication Layer)**](../../../README.md)

***

# validatePolicy()

> **validatePolicy**(`fields`, `policy?`, `now?`): `string`[]

Defined in: [packages/siwx-core/src/validateMessage.ts:136](https://github.com/TuwaIO/siwx/blob/fcaa3a6f9f1375901c6bae0f335f995349246d8e/packages/siwx-core/src/validateMessage.ts#L136)

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
