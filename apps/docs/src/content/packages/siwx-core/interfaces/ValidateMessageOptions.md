# ValidateMessageOptions

Defined in: [types.ts:172](https://github.com/TuwaIO/siwx/blob/main/packages/siwx-core/src/types.ts#L172)

Options of [validateMessage](/packages/siwx-core/functions/validateMessage.md).

## Properties

### policy?

> `optional` **policy?**: [`SiwxVerificationPolicy`](/packages/siwx-core/interfaces/SiwxVerificationPolicy.md)

Defined in: [types.ts:182](https://github.com/TuwaIO/siwx/blob/main/packages/siwx-core/src/types.ts#L182)

Verification policy to enforce on top of the format checks. See [validatePolicy](/packages/siwx-core/functions/validatePolicy.md).

***

### skipExpiration?

> `optional` **skipExpiration?**: `boolean`

Defined in: [types.ts:177](https://github.com/TuwaIO/siwx/blob/main/packages/siwx-core/src/types.ts#L177)

Skips the check that `expirationTime` has not passed (the format is still checked).
Not recommended in production.
