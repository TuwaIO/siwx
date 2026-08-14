[**API Reference — @tuwaio/siwx (CAIP-122 Authentication Layer)**](../../../README.md)

***

# verifySiwxPayload()

> **verifySiwxPayload**(`payload`, `options?`): `Promise`\<[`ServerVerifyResult`](../interfaces/ServerVerifyResult.md)\>

Defined in: [packages/siwx-server/src/server.ts:37](https://github.com/TuwaIO/siwx/blob/5afdbf8444bc2b94d7f938774996543e40e8ee51/packages/siwx-server/src/server.ts#L37)

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
