# SolanaWalletAdapterSignerTarget

> **SolanaWalletAdapterSignerTarget** = `SolanaMessageSignerTarget`

Defined in: [signer.ts:70](https://github.com/TuwaIO/siwx/blob/main/packages/siwx-solana/src/signer.ts#L70)

The value of `useWallet()` from `@solana/wallet-adapter-react` (v1) or `@solana/wallet-adapter` (v3), or any other
`{ wallet, account }` objects with a signing capability, such as a wallet exposing an `adapter` or a `signMessages`
method: [`SolanaMessageSignerTarget`](https://orbit.docs.tuwa.io/packages/orbit-solana/interfaces/SolanaMessageSignerTarget)
of `@tuwaio/orbit-solana` (its fields are described there), whose signer signs it.

Every field may be missing or `null`, as in `useWallet()` before a wallet connects: the signer looks for a signing
capability only when it is called, and rejects when it finds none.
