# generateServerNonce()

> **generateServerNonce**(): `string`

Defined in: [siwx-core/src/validateMessage.ts:327](https://github.com/TuwaIO/siwx/blob/main/packages/siwx-core/src/validateMessage.ts#L327)

Generates a random CAIP-122 nonce: 16 bytes from `globalThis.crypto.getRandomValues`, hex-encoded.
Works in browsers, Node.js 20+ and edge runtimes that provide the Web Crypto API.

## Returns

`string`

A 32-character lowercase hexadecimal string.

## Throws

If `globalThis.crypto` is not available in the runtime.

## Example

```ts
const nonce = generateNonce(); // e.g., "a4f3b2c1d0e5f6789..."
```
