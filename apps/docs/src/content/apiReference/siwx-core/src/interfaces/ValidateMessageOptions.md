[**API Reference — @tuwaio/siwx (CAIP-122 Authentication Layer)**](../../../README.md)

***

# ValidateMessageOptions

Defined in: [packages/siwx-core/src/types.ts:154](https://github.com/TuwaIO/siwx/blob/023cd641f42d16bcbd0c2945fcfa41700389bfc5/packages/siwx-core/src/types.ts#L154)

Options for validating a CAIP-122 message object.

## Properties

### policy?

> `optional` **policy?**: [`SiwxVerificationPolicy`](SiwxVerificationPolicy.md)

Defined in: [packages/siwx-core/src/types.ts:164](https://github.com/TuwaIO/siwx/blob/023cd641f42d16bcbd0c2945fcfa41700389bfc5/packages/siwx-core/src/types.ts#L164)

Optional verification policy to enforce on the message fields.

***

### skipExpiration?

> `optional` **skipExpiration?**: `boolean`

Defined in: [packages/siwx-core/src/types.ts:159](https://github.com/TuwaIO/siwx/blob/023cd641f42d16bcbd0c2945fcfa41700389bfc5/packages/siwx-core/src/types.ts#L159)

If true, skips the `expirationTime` validation check.
Not recommended for production use.
