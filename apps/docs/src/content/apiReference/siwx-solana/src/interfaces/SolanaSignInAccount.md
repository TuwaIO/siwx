[**API Reference — @tuwaio/siwx (CAIP-122 Authentication Layer)**](../../../README.md)

***

# SolanaSignInAccount

Defined in: [packages/siwx-solana/src/types.ts:10](https://github.com/TuwaIO/siwx/blob/0ca0708dd74b07eb7d1d46e0b3ebb6c65b68bbc8/packages/siwx-solana/src/types.ts#L10)

Minimal Wallet Standard account interface returned by `solana:signIn`.

## Properties

### address

> **address**: `string`

Defined in: [packages/siwx-solana/src/types.ts:12](https://github.com/TuwaIO/siwx/blob/0ca0708dd74b07eb7d1d46e0b3ebb6c65b68bbc8/packages/siwx-solana/src/types.ts#L12)

Base58 encoded wallet address.

***

### publicKey?

> `optional` **publicKey?**: `Uint8Array`\<`ArrayBufferLike`\>

Defined in: [packages/siwx-solana/src/types.ts:14](https://github.com/TuwaIO/siwx/blob/0ca0708dd74b07eb7d1d46e0b3ebb6c65b68bbc8/packages/siwx-solana/src/types.ts#L14)

Raw public key bytes.
