# parseMessage()

> **parseMessage**(`message`): [`SiwxMessageFields`](/packages/siwx-core/interfaces/SiwxMessageFields.md)

Defined in: [parseMessage.ts:42](https://github.com/TuwaIO/siwx/blob/main/packages/siwx-core/src/parseMessage.ts#L42)

Parses a CAIP-122 message string (as produced by [buildMessage](/packages/siwx-core/functions/buildMessage.md)) back into its fields.

Pure function. It checks the message structure and the presence of the required fields (`URI`, `Version`,
`Chain ID`, `Nonce`, `Issued At`) but not their format or timing; use [validateMessage](/packages/siwx-core/functions/validateMessage.md) for that.

## Parameters

### message

`string`

The raw message string that was signed.

## Returns

[`SiwxMessageFields`](/packages/siwx-core/interfaces/SiwxMessageFields.md)

The fields found in the message. `version` and `chainId` are taken as written, without validation.

## Throws

[SiwxParseError](/packages/siwx-core/classes/SiwxParseError.md) If the header or the blank separator lines are malformed, or a required field is
missing.

## Example

```ts
const parsed = parseMessage(rawMessageString);
console.log(parsed.address); // "eip155:1:0xAb5..."
```
