[**API Reference — @tuwaio/siwx (CAIP-122 Authentication Layer)**](../../../README.md)

***

# SolanaVerifyPayload

> **SolanaVerifyPayload** = `SiwxVerifyPayload` \| \{ `message`: `string` \| `Uint8Array`; `signature`: `string` \| `Uint8Array`; \} \| [`SolanaSignInOutput`](../interfaces/SolanaSignInOutput.md) \| \{ `output`: [`SolanaSignInOutput`](../interfaces/SolanaSignInOutput.md); \}

Defined in: [packages/siwx-solana/src/types.ts:34](https://github.com/TuwaIO/siwx/blob/bac8be290114bb4720f42e8f92d70040e76d06fe/packages/siwx-solana/src/types.ts#L34)

Flexible input type for Solana SIWX verification.
Accepts standard SIWX payload `{ message, signature }`,
raw Uint8Array buffers, or Wallet Standard `solana:signIn` output objects.
