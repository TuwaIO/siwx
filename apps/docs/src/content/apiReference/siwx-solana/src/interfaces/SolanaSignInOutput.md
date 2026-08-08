[**API Reference — @tuwaio/siwx (CAIP-122 Authentication Layer)**](../../../README.md)

***

# SolanaSignInOutput

Defined in: [packages/siwx-solana/src/types.ts:20](https://github.com/TuwaIO/siwx/blob/5bd36b810264d62d40a05e48557149b572817954/packages/siwx-solana/src/types.ts#L20)

Output object structure returned by Wallet Standard `solana:signIn` feature.

## Properties

### account

> **account**: [`SolanaSignInAccount`](SolanaSignInAccount.md)

Defined in: [packages/siwx-solana/src/types.ts:22](https://github.com/TuwaIO/siwx/blob/5bd36b810264d62d40a05e48557149b572817954/packages/siwx-solana/src/types.ts#L22)

Account that signed the message.

***

### signature

> **signature**: `string` \| `Uint8Array`\<`ArrayBufferLike`\>

Defined in: [packages/siwx-solana/src/types.ts:26](https://github.com/TuwaIO/siwx/blob/5bd36b810264d62d40a05e48557149b572817954/packages/siwx-solana/src/types.ts#L26)

Raw signature bytes or base58 string.

***

### signedMessage

> **signedMessage**: `string` \| `Uint8Array`\<`ArrayBufferLike`\>

Defined in: [packages/siwx-solana/src/types.ts:24](https://github.com/TuwaIO/siwx/blob/5bd36b810264d62d40a05e48557149b572817954/packages/siwx-solana/src/types.ts#L24)

Raw message bytes or string that was signed.
