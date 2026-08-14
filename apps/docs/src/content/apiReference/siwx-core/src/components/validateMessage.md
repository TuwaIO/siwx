[**API Reference — @tuwaio/siwx (CAIP-122 Authentication Layer)**](../../../README.md)

***

# validateMessage()

> **validateMessage**(`fields`, `options?`): [`SiwxValidationResult`](../interfaces/SiwxValidationResult.md)

Defined in: [packages/siwx-core/src/validateMessage.ts:240](https://github.com/TuwaIO/siwx/blob/3e92d2c12c74ad4820f3f675f56b978c23099c12/packages/siwx-core/src/validateMessage.ts#L240)

Validates all fields of a CAIP-122 message object.
Collects all errors and returns them together rather than failing on the first.

## Parameters

### fields

[`SiwxMessageFields`](../interfaces/SiwxMessageFields.md)

The message fields to validate.

### options?

[`ValidateMessageOptions`](../interfaces/ValidateMessageOptions.md)

Optional validation options or verification policy.

## Returns

[`SiwxValidationResult`](../interfaces/SiwxValidationResult.md)

A `SiwxValidationResult` with `valid: true` or a list of errors.

## Example

```ts
const result = validateMessage(parsedMessage, {
  policy: { expectedDomain: 'tuwa.io', requireExpirationTime: true },
});
if (!result.valid) {
  console.error(result.errors);
}
```
