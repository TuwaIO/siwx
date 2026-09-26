# SolanaSiwxSignerTarget

> **SolanaSiwxSignerTarget** = [`SolanaWalletStandardSignerTarget`](/packages/siwx-solana/interfaces/SolanaWalletStandardSignerTarget.md) \| `MessageModifyingSigner` \| [`SolanaLegacyMessageSigner`](/packages/siwx-solana/interfaces/SolanaLegacyMessageSigner.md) \| \{ `account?`: `object`; `wallet?`: `object`; \}

Defined in: [signer.ts:60](https://github.com/TuwaIO/siwx/blob/main/packages/siwx-solana/src/signer.ts#L60)

What [createSolanaSiwxSigner](/packages/siwx-solana/functions/createSolanaSiwxSigner.md) can sign with:

- a Wallet Standard `{ wallet, account }` pair ([SolanaWalletStandardSignerTarget](/packages/siwx-solana/interfaces/SolanaWalletStandardSignerTarget.md));
- an `@solana/kit` `MessageModifyingSigner`;
- a legacy adapter with `signMessage(bytes)` ([SolanaLegacyMessageSigner](/packages/siwx-solana/interfaces/SolanaLegacyMessageSigner.md));
- any `{ wallet, account }` objects with one of these capabilities, such as a wallet exposing an `adapter` or a
  `signMessages` method.

The signer uses the first capability it finds: `modifyAndSignMessages`, the `solana:signMessage` feature of
`wallet.features`, a `signMessages` method, or a `signMessage` method (also looked up on `adapter`).
