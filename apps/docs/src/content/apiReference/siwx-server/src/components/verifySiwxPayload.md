[**API Reference — @tuwaio/siwx (CAIP-122 Authentication Layer)**](../../../README.md)

***

# verifySiwxPayload()

> **verifySiwxPayload**(`payload`, `options?`): `Promise`\<[`ServerVerifyResult`](../interfaces/ServerVerifyResult.md)\>

Defined in: [packages/siwx-server/src/server.ts:47](https://github.com/TuwaIO/siwx/blob/ecff9ffa6386dee5a576efabec2ed72f03dde624/packages/siwx-server/src/server.ts#L47)

Parses and validates a raw CAIP-122 payload (message + signature) on the server side.
Dynamically routes verification to the correct chain adapter based on the CAIP-2 namespace.

This function is the primary entry point for server-side authentication.
It handles EVM (eip155) and Solana chains.

## Parameters

### payload

`SiwxVerifyPayload`

The `{ message, signature }` payload sent by the client.

### options?

[`ServerVerifyOptions`](../interfaces/ServerVerifyOptions.md) = `{}`

Optional server-side verification options (nonce replay protection, etc.).

## Returns

`Promise`\<[`ServerVerifyResult`](../interfaces/ServerVerifyResult.md)\>

A `ServerVerifyResult` with `success: true` and the parsed session data, or an error.

## Example

```ts
// In a Next.js API route or NestJS controller:
const result = await verifySiwxPayload({ message, signature }, {
  usedNonces: await redis.smembers('used_nonces'),
});
if (result.success) {
  // Session is valid — issue a cookie or JWT
}
```
