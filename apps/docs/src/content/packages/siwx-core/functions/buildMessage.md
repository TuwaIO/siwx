# buildMessage()

> **buildMessage**(`fields`): `string`

Defined in: [buildMessage.ts:38](https://github.com/TuwaIO/siwx/blob/main/packages/siwx-core/src/buildMessage.ts#L38)

Formats CAIP-122 message fields into the plain-text message that the wallet signs (the EIP-4361 layout used by
CAIP-122). Optional fields are omitted when empty.

Pure function. It only checks that the message can be built: every required field is a non-empty string and no
field contains a line break (which would add or change lines of the signed message). It does not check formats or
timing: run [validateMessage](/packages/siwx-core/functions/validateMessage.md) for that, as verifiers do.

## Parameters

### fields

[`SiwxMessageFields`](/packages/siwx-core/interfaces/SiwxMessageFields.md)

The message fields to format.

## Returns

`string`

The message lines joined with `\n`, ready to be signed and parseable by [parseMessage](/packages/siwx-core/functions/parseMessage.md).

## Throws

[SiwxValidationError](/packages/siwx-core/classes/SiwxValidationError.md) When a required field is missing or empty, or a field contains a line break.

## Example

```ts
const message = buildMessage({
  domain: 'app.tuwa.io',
  address: 'eip155:1:0xAb5801a7D398351b8bE11C439e05C5B3259aeC9B',
  uri: 'https://app.tuwa.io',
  version: '1',
  chainId: 'eip155:1',
  nonce: 'abc123xyz',
  issuedAt: new Date().toISOString(),
  statement: 'Sign in to TUWA.',
});
```
