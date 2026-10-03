# verifySiwxPayload()

> **verifySiwxPayload**(`payload`, `options?`): `Promise`\<[`ServerVerifyResult`](/packages/siwx-server/server/interfaces/ServerVerifyResult.md)\>

Defined in: [siwx-server/src/server.ts:47](https://github.com/TuwaIO/siwx/blob/main/packages/siwx-server/src/server.ts#L47)

Verifies a signed CAIP-122 message on the server, for any supported chain.

Steps: parse the message, run [validateMessage](/packages/siwx-server/server/functions/validateMessage.md) with `options.policy` (format, expiration with
`clockSkewSeconds`, `notBefore` and the policy rules), reject nonces listed in `options.usedNonces`, then route by the `chainId` namespace to `verifyEvmSignature`
(`@tuwaio/siwx-evm`, with the EIP-1271 fallback when `options.publicClient` is set) or `verifyEd25519`
(`@tuwaio/siwx-solana`).

Side effects: dynamically imports the chain package of the namespace, so `@tuwaio/siwx-evm` and/or
`@tuwaio/siwx-solana` must be installed for the chains you accept; the EIP-1271 fallback makes one RPC call.
It does not consume nonces or create sessions: pair it with a [SiwxNonceStore](/packages/siwx-server/server/interfaces/SiwxNonceStore.md) and a
[SiwxSessionStore](/packages/siwx-server/server/interfaces/SiwxSessionStore.md), or use the handlers of `@tuwaio/siwx-server/next`.

## Parameters

### payload

[`SiwxVerifyPayload`](/packages/siwx-core/interfaces/SiwxVerifyPayload.md)

The `{ message, signature }` sent by the client.

### options?

[`ServerVerifyOptions`](/packages/siwx-server/server/interfaces/ServerVerifyOptions.md) = `{}`

Policy, replay protection and chain options.

## Returns

`Promise`\<[`ServerVerifyResult`](/packages/siwx-server/server/interfaces/ServerVerifyResult.md)\>

`{ success: true, data, namespace }` with the parsed message, or `{ success: false, error }`. Never
throws: every failure is returned as `error`.
