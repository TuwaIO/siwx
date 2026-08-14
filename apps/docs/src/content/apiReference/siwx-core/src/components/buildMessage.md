[**API Reference — @tuwaio/siwx (CAIP-122 Authentication Layer)**](../../../README.md)

***

# buildMessage()

> **buildMessage**(`fields`): `string`

Defined in: [packages/siwx-core/src/buildMessage.ts:29](https://github.com/TuwaIO/siwx/blob/3e92d2c12c74ad4820f3f675f56b978c23099c12/packages/siwx-core/src/buildMessage.ts#L29)

Builds a CAIP-122 compliant sign-in message string from the provided fields.
The output format follows the EIP-4361 / CAIP-122 specification exactly.

## Parameters

### fields

[`SiwxMessageFields`](../interfaces/SiwxMessageFields.md)

The structured fields to encode into the message.

## Returns

`string`

A formatted, human-readable message string ready for wallet signing.

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
