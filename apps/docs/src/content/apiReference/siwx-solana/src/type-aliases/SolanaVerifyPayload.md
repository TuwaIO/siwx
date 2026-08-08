[**API Reference — @tuwaio/siwx (CAIP-122 Authentication Layer)**](../../../README.md)

***

# SolanaVerifyPayload

> **SolanaVerifyPayload** = `SiwxVerifyPayload` \| \{ `message`: `string` \| `Uint8Array`; `signature`: `string` \| `Uint8Array`; \} \| [`SolanaSignInOutput`](../interfaces/SolanaSignInOutput.md) \| \{ `output`: [`SolanaSignInOutput`](../interfaces/SolanaSignInOutput.md); \}

Defined in: [packages/siwx-solana/src/types.ts:34](https://github.com/TuwaIO/siwx/blob/937790ab6674ad6603e43d2020db35b698d6f5b0/packages/siwx-solana/src/types.ts#L34)

Flexible input type for Solana SIWX verification.
Accepts standard SIWX payload `{ message, signature }`,
raw Uint8Array buffers, or Wallet Standard `solana:signIn` output objects.
