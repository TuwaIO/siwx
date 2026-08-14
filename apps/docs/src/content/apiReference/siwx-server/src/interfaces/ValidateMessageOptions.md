[**API Reference — @tuwaio/siwx (CAIP-122 Authentication Layer)**](../../../README.md)

***

# ValidateMessageOptions

Defined in: packages/siwx-core/dist/index.d.ts:130

Options for validating a CAIP-122 message object.

## Properties

### policy?

> `optional` **policy?**: [`SiwxVerificationPolicy`](SiwxVerificationPolicy.md)

Defined in: packages/siwx-core/dist/index.d.ts:139

Optional verification policy to enforce on the message fields.

***

### skipExpiration?

> `optional` **skipExpiration?**: `boolean`

Defined in: packages/siwx-core/dist/index.d.ts:135

If true, skips the `expirationTime` validation check.
Not recommended for production use.
