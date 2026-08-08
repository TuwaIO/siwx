[**API Reference — @tuwaio/siwx (CAIP-122 Authentication Layer)**](../../../README.md)

***

# SolanaSignInAccount

Defined in: [packages/siwx-solana/src/types.ts:10](https://github.com/TuwaIO/siwx/blob/ecff9ffa6386dee5a576efabec2ed72f03dde624/packages/siwx-solana/src/types.ts#L10)

Minimal Wallet Standard account interface returned by `solana:signIn`.

## Properties

### address

> **address**: `string`

Defined in: [packages/siwx-solana/src/types.ts:12](https://github.com/TuwaIO/siwx/blob/ecff9ffa6386dee5a576efabec2ed72f03dde624/packages/siwx-solana/src/types.ts#L12)

Base58 encoded wallet address.

***

### publicKey?

> `optional` **publicKey?**: `Uint8Array`\<`ArrayBufferLike`\>

Defined in: [packages/siwx-solana/src/types.ts:14](https://github.com/TuwaIO/siwx/blob/ecff9ffa6386dee5a576efabec2ed72f03dde624/packages/siwx-solana/src/types.ts#L14)

Raw public key bytes.
