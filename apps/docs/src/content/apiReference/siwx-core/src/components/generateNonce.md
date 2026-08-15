[**API Reference — @tuwaio/siwx (CAIP-122 Authentication Layer)**](../../../README.md)

***

# generateNonce()

> **generateNonce**(): `string`

Defined in: [packages/siwx-core/src/validateMessage.ts:324](https://github.com/TuwaIO/siwx/blob/0ca0708dd74b07eb7d1d46e0b3ebb6c65b68bbc8/packages/siwx-core/src/validateMessage.ts#L324)

Generates a cryptographically secure random nonce string suitable for CAIP-122 messages.
Produces a 16-byte random hex string (32 characters).

## Returns

`string`

A 32-character hexadecimal nonce string.

## Example

```ts
const nonce = generateNonce(); // e.g., "a4f3b2c1d0e5f6789..."
```
