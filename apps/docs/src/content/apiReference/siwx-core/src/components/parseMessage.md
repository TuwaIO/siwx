[**API Reference — @tuwaio/siwx (CAIP-122 Authentication Layer)**](../../../README.md)

***

# parseMessage()

> **parseMessage**(`message`): [`SiwxMessageFields`](../interfaces/SiwxMessageFields.md)

Defined in: [packages/siwx-core/src/parseMessage.ts:31](https://github.com/TuwaIO/siwx/blob/937790ab6674ad6603e43d2020db35b698d6f5b0/packages/siwx-core/src/parseMessage.ts#L31)

Parses a raw CAIP-122 compliant message string into a structured `ParsedSiwxMessage` object.

## Parameters

### message

`string`

The raw message string produced by `buildMessage` and signed by the wallet.

## Returns

[`SiwxMessageFields`](../interfaces/SiwxMessageFields.md)

The structured fields extracted from the message.

## Throws

If the message is malformed or missing required fields.

## Example

```ts
const parsed = parseMessage(rawMessageString);
console.log(parsed.address); // "eip155:1:0xAb5..."
```
