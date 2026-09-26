# SolanaVerifyPayload

> **SolanaVerifyPayload** = [`SiwxVerifyPayload`](/packages/siwx-core/interfaces/SiwxVerifyPayload.md) \| \{ `message`: `string` \| `Uint8Array`; `signature`: `string` \| `Uint8Array`; \} \| [`SolanaSignInOutput`](/packages/siwx-solana/interfaces/SolanaSignInOutput.md) \| \{ `output`: [`SolanaSignInOutput`](/packages/siwx-solana/interfaces/SolanaSignInOutput.md); \}

Defined in: [types.ts:33](https://github.com/TuwaIO/siwx/blob/main/packages/siwx-solana/src/types.ts#L33)

Input of [verifyEd25519](/packages/siwx-solana/functions/verifyEd25519.md): a `{ message, signature }` payload (strings or bytes), a Wallet Standard
`solana:signIn` output, or that output wrapped as `{ output }`. String signatures are base58-encoded.
