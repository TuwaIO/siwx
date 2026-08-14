[**API Reference — @tuwaio/siwx (CAIP-122 Authentication Layer)**](../../../README.md)

***

# verifySiwxPayload()

> **verifySiwxPayload**(`payload`, `options?`): `Promise`\<[`ServerVerifyResult`](../interfaces/ServerVerifyResult.md)\>

Defined in: [packages/siwx-server/src/server.ts:36](https://github.com/TuwaIO/siwx/blob/bbc740ccb7f405b75bd0d4e5a1bc973b1e131514/packages/siwx-server/src/server.ts#L36)

Parses and validates a raw CAIP-122 payload (message + signature) on the server side.
Dynamically routes verification to the correct chain adapter based on the CAIP-2 namespace.

## Parameters

### payload

`SiwxVerifyPayload`

The `{ message, signature }` payload sent by the client.

### options?

[`ServerVerifyOptions`](../interfaces/ServerVerifyOptions.md) = `{}`

Server-side verification options (policy, nonce replay protection, etc.).

## Returns

`Promise`\<[`ServerVerifyResult`](../interfaces/ServerVerifyResult.md)\>

A `ServerVerifyResult` with `success: true` and the parsed session data, or an error.
