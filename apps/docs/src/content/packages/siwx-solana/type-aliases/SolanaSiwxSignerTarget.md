# SolanaSiwxSignerTarget

> **SolanaSiwxSignerTarget** = [`SolanaWalletStandardSignerTarget`](/packages/siwx-solana/interfaces/SolanaWalletStandardSignerTarget.md) \| `MessageModifyingSigner` \| [`SolanaLegacyMessageSigner`](/packages/siwx-solana/interfaces/SolanaLegacyMessageSigner.md) \| [`SolanaWalletAdapterSignerTarget`](/packages/siwx-solana/interfaces/SolanaWalletAdapterSignerTarget.md)

Defined in: [signer.ts:153](https://github.com/TuwaIO/siwx/blob/main/packages/siwx-solana/src/signer.ts#L153)

What [createSolanaSiwxSigner](/packages/siwx-solana/functions/createSolanaSiwxSigner.md) can sign with:

- a Wallet Standard `{ wallet, account }` pair ([SolanaWalletStandardSignerTarget](/packages/siwx-solana/interfaces/SolanaWalletStandardSignerTarget.md));
- an `@solana/kit` `MessageModifyingSigner`;
- a legacy adapter with `signMessage(bytes)` ([SolanaLegacyMessageSigner](/packages/siwx-solana/interfaces/SolanaLegacyMessageSigner.md));
- `useWallet()` of `@solana/wallet-adapter` v1 or v3, or any `{ wallet, account }` objects with one of these
  capabilities ([SolanaWalletAdapterSignerTarget](/packages/siwx-solana/interfaces/SolanaWalletAdapterSignerTarget.md)).

The signer uses the first capability it finds: `modifyAndSignMessages`, the `solana:signMessage` feature of
`wallet.features`, a `signMessages` method, or a `signMessage` method (looked up on `wallet`, its `adapter`, `account`
and the target itself, so `useWallet()` of `@solana/wallet-adapter` v1 and v3 works as is). Off-chain messages use
the `solana:signOffchainMessage` feature of `wallet.features` or a `signOffchainMessage` method.
