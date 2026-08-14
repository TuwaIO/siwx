[**API Reference — @tuwaio/siwx (CAIP-122 Authentication Layer)**](../../../README.md)

***

# generateServerNonce()

> **generateServerNonce**(): `string`

Defined in: packages/siwx-core/dist/index.d.ts:432

Generates a cryptographically secure random nonce string suitable for CAIP-122 messages.
Produces a 16-byte random hex string (32 characters).

## Returns

`string`

A 32-character hexadecimal nonce string.

## Example

```ts
const nonce = generateNonce(); // e.g., "a4f3b2c1d0e5f6789..."
```
