[**API Reference — @tuwaio/siwx (CAIP-122 Authentication Layer)**](../../../README.md)

***

# ValidateMessageOptions

Defined in: [packages/siwx-core/src/types.ts:154](https://github.com/TuwaIO/siwx/blob/fcaa3a6f9f1375901c6bae0f335f995349246d8e/packages/siwx-core/src/types.ts#L154)

Options for validating a CAIP-122 message object.

## Properties

### policy?

> `optional` **policy?**: [`SiwxVerificationPolicy`](SiwxVerificationPolicy.md)

Defined in: [packages/siwx-core/src/types.ts:164](https://github.com/TuwaIO/siwx/blob/fcaa3a6f9f1375901c6bae0f335f995349246d8e/packages/siwx-core/src/types.ts#L164)

Optional verification policy to enforce on the message fields.

***

### skipExpiration?

> `optional` **skipExpiration?**: `boolean`

Defined in: [packages/siwx-core/src/types.ts:159](https://github.com/TuwaIO/siwx/blob/fcaa3a6f9f1375901c6bae0f335f995349246d8e/packages/siwx-core/src/types.ts#L159)

If true, skips the `expirationTime` validation check.
Not recommended for production use.
