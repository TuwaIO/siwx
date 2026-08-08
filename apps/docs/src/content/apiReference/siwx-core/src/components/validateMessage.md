[**API Reference — @tuwaio/siwx (CAIP-122 Authentication Layer)**](../../../README.md)

***

# validateMessage()

> **validateMessage**(`fields`, `options?`): [`SiwxValidationResult`](../interfaces/SiwxValidationResult.md)

Defined in: [packages/siwx-core/src/validateMessage.ts:137](https://github.com/TuwaIO/siwx/blob/9e00d3ba85452b84c97c3a62abd4327d95c89ec5/packages/siwx-core/src/validateMessage.ts#L137)

Validates all fields of a CAIP-122 message object.
Collects all errors and returns them together rather than failing on the first.

## Parameters

### fields

[`SiwxMessageFields`](../interfaces/SiwxMessageFields.md)

The message fields to validate.

### options?

#### skipExpiration?

`boolean`

## Returns

[`SiwxValidationResult`](../interfaces/SiwxValidationResult.md)

A `SiwxValidationResult` with `valid: true` or a list of errors.

## Example

```ts
const result = validateMessage(parsedMessage);
if (!result.valid) {
  console.error(result.errors);
}
```
