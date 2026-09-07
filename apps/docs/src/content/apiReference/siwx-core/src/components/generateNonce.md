[**API Reference — @tuwaio/siwx (CAIP-122 Authentication Layer)**](../../../README.md)

***

# generateNonce()

> **generateNonce**(): `string`

Defined in: [packages/siwx-core/src/validateMessage.ts:324](https://github.com/TuwaIO/siwx/blob/83013b6156828e4328756382b00fca539cc26a69/packages/siwx-core/src/validateMessage.ts#L324)

Generates a cryptographically secure random nonce string suitable for CAIP-122 messages.
Produces a 16-byte random hex string (32 characters).

## Returns

`string`

A 32-character hexadecimal nonce string.

## Example

```ts
const nonce = generateNonce(); // e.g., "a4f3b2c1d0e5f6789..."
```
