# SolanaSignInOutput

Defined in: [types.ts:20](https://github.com/TuwaIO/siwx/blob/main/packages/siwx-solana/src/types.ts#L20)

Output of the Wallet Standard `solana:signIn` feature, accepted as-is by [verifyEd25519](/packages/siwx-solana/functions/verifyEd25519.md).

## Properties

### account

> **account**: [`SolanaSignInAccount`](/packages/siwx-solana/interfaces/SolanaSignInAccount.md)

Defined in: [types.ts:22](https://github.com/TuwaIO/siwx/blob/main/packages/siwx-solana/src/types.ts#L22)

Account that signed the message.

***

### signature

> **signature**: `string` \| `Uint8Array`\<`ArrayBufferLike`\>

Defined in: [types.ts:26](https://github.com/TuwaIO/siwx/blob/main/packages/siwx-solana/src/types.ts#L26)

The ed25519 signature, as 64 raw bytes or a base58 string.

***

### signedMessage

> **signedMessage**: `string` \| `Uint8Array`\<`ArrayBufferLike`\>

Defined in: [types.ts:24](https://github.com/TuwaIO/siwx/blob/main/packages/siwx-solana/src/types.ts#L24)

The signed message, as UTF-8 bytes or a string. It must be a CAIP-122 message.
