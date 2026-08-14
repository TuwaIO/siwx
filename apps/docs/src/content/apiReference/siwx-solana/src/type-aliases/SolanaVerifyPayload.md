[**API Reference — @tuwaio/siwx (CAIP-122 Authentication Layer)**](../../../README.md)

***

# SolanaVerifyPayload

> **SolanaVerifyPayload** = `SiwxVerifyPayload` \| \{ `message`: `string` \| `Uint8Array`; `signature`: `string` \| `Uint8Array`; \} \| [`SolanaSignInOutput`](../interfaces/SolanaSignInOutput.md) \| \{ `output`: [`SolanaSignInOutput`](../interfaces/SolanaSignInOutput.md); \}

Defined in: [packages/siwx-solana/src/types.ts:34](https://github.com/TuwaIO/siwx/blob/bbc740ccb7f405b75bd0d4e5a1bc973b1e131514/packages/siwx-solana/src/types.ts#L34)

Flexible input type for Solana SIWX verification.
Accepts standard SIWX payload `{ message, signature }`,
raw Uint8Array buffers, or Wallet Standard `solana:signIn` output objects.
