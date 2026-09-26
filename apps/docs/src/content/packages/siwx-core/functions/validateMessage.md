# validateMessage()

> **validateMessage**(`fields`, `options?`): [`SiwxValidationResult`](/packages/siwx-core/interfaces/SiwxValidationResult.md)

Defined in: [validateMessage.ts:266](https://github.com/TuwaIO/siwx/blob/main/packages/siwx-core/src/validateMessage.ts#L266)

Validates the format of CAIP-122 message fields and, optionally, a verification policy. Collects every failure
instead of stopping at the first one.

Checks: non-empty single-line `domain`, CAIP-10 `address`, `http(s)://` `uri`, `version` `"1"`, CAIP-2 `chainId`,
alphanumeric `nonce` of at least 8 characters, ISO 8601 `issuedAt` / `expirationTime` / `notBefore`, single-line
`statement`, and that `expirationTime` (plus the policy clock skew, 60 seconds by default) has not passed.
Then it runs [validatePolicy](/packages/siwx-core/functions/validatePolicy.md) with `options.policy`, or with an empty policy: so `issuedAt` in the future
and a `notBefore` that has not been reached are always rejected (unless `enforceNotBefore` is `false`), and the
other policy rules apply only when set. Timing checks use the current time.

Does not verify the signature; the chain packages and `@tuwaio/siwx-server` do that and call this function.

## Parameters

### fields

[`SiwxMessageFields`](/packages/siwx-core/interfaces/SiwxMessageFields.md)

The message fields to validate.

### options?

[`ValidateMessageOptions`](/packages/siwx-core/interfaces/ValidateMessageOptions.md)

Skip the expiration check or enforce a [SiwxVerificationPolicy](/packages/siwx-core/interfaces/SiwxVerificationPolicy.md) (see [validatePolicy](/packages/siwx-core/functions/validatePolicy.md)).

## Returns

[`SiwxValidationResult`](/packages/siwx-core/interfaces/SiwxValidationResult.md)

`{ valid: true, errors: [] }`, or `valid: false` with a description of every failed check.

## Example

```ts
const result = validateMessage(parsedMessage, {
  policy: { expectedDomain: 'tuwa.io', requireExpirationTime: true },
});
if (!result.valid) {
  console.error(result.errors);
}
```
