[**API Reference — @tuwaio/siwx (CAIP-122 Authentication Layer)**](../../../README.md)

***

# SolanaSignInAccount

Defined in: [packages/siwx-solana/src/types.ts:10](https://github.com/TuwaIO/siwx/blob/bac8be290114bb4720f42e8f92d70040e76d06fe/packages/siwx-solana/src/types.ts#L10)

Minimal Wallet Standard account interface returned by `solana:signIn`.

## Properties

### address

> **address**: `string`

Defined in: [packages/siwx-solana/src/types.ts:12](https://github.com/TuwaIO/siwx/blob/bac8be290114bb4720f42e8f92d70040e76d06fe/packages/siwx-solana/src/types.ts#L12)

Base58 encoded wallet address.

***

### publicKey?

> `optional` **publicKey?**: `Uint8Array`\<`ArrayBufferLike`\>

Defined in: [packages/siwx-solana/src/types.ts:14](https://github.com/TuwaIO/siwx/blob/bac8be290114bb4720f42e8f92d70040e76d06fe/packages/siwx-solana/src/types.ts#L14)

Raw public key bytes.
