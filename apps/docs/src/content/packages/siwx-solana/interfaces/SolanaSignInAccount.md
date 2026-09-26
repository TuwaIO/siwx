# SolanaSignInAccount

Defined in: [types.ts:10](https://github.com/TuwaIO/siwx/blob/main/packages/siwx-solana/src/types.ts#L10)

Minimal account shape of a Wallet Standard `solana:signIn` output.

## Properties

### address

> **address**: `string`

Defined in: [types.ts:12](https://github.com/TuwaIO/siwx/blob/main/packages/siwx-solana/src/types.ts#L12)

Base58-encoded wallet address. Not used for verification: the signer is taken from the message `address`.

***

### publicKey?

> `optional` **publicKey?**: `Uint8Array`\<`ArrayBufferLike`\>

Defined in: [types.ts:14](https://github.com/TuwaIO/siwx/blob/main/packages/siwx-solana/src/types.ts#L14)

Raw public key bytes. Not used for verification.
