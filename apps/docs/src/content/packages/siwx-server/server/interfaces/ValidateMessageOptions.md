# ValidateMessageOptions

Defined in: [siwx-core/src/types.ts:171](https://github.com/TuwaIO/siwx/blob/main/packages/siwx-core/src/types.ts#L171)

Options of [validateMessage](/packages/siwx-server/server/functions/validateMessage.md).

## Properties

### policy?

> `optional` **policy?**: [`SiwxVerificationPolicy`](/packages/siwx-server/server/interfaces/SiwxVerificationPolicy.md)

Defined in: [siwx-core/src/types.ts:181](https://github.com/TuwaIO/siwx/blob/main/packages/siwx-core/src/types.ts#L181)

Verification policy to enforce on top of the format checks. See [validatePolicy](/packages/siwx-server/server/functions/validatePolicy.md).

***

### skipExpiration?

> `optional` **skipExpiration?**: `boolean`

Defined in: [siwx-core/src/types.ts:176](https://github.com/TuwaIO/siwx/blob/main/packages/siwx-core/src/types.ts#L176)

Skips the check that `expirationTime` has not passed (the format is still checked).
Not recommended in production.
