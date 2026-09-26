# verifyEd25519()

> **verifyEd25519**(`payload`, `options?`): `Promise`\<[`SiwxVerifyResult`](/packages/siwx-core/interfaces/SiwxVerifyResult.md)\>

Defined in: [verify.ts:130](https://github.com/TuwaIO/siwx/blob/main/packages/siwx-solana/src/verify.ts#L130)

Verifies a `solana` CAIP-122 message signed with ed25519.

Parses the message, requires a `solana` chain and a 64-byte signature, runs `validateMessage` from `@tuwaio/siwx-core` (format,
expiration, `notBefore` and an `issuedAt` in the future), validates the message `address` with `@solana/kit` and checks the signature against
that public key with Web Crypto (`crypto.subtle`, algorithm `Ed25519`). Runs locally, without RPC calls. Nonce,
domain and policy checks are the caller's job (see `@tuwaio/siwx-server`).

Requires a runtime with Ed25519 support in Web Crypto (current browsers, Node.js 20+, edge runtimes).

## Parameters

### payload

[`SolanaVerifyPayload`](/packages/siwx-solana/type-aliases/SolanaVerifyPayload.md)

`{ message, signature }` (base58 string or bytes), or a Wallet Standard `solana:signIn` output.

### options?

`skipExpiration` skips the check that `expirationTime` has not passed.

#### skipExpiration?

`boolean`

## Returns

`Promise`\<[`SiwxVerifyResult`](/packages/siwx-core/interfaces/SiwxVerifyResult.md)\>

`{ success: true, data }`, or `{ success: false, error }`. Never throws: decoding, parse, validation and
crypto errors are returned as `error`.

## Example

```ts
const result = await verifyEd25519(solanaSignInOutput);
if (result.success) console.log('Authenticated:', result.data?.address);
```
