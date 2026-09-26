# SolanaWalletStandardSignerTarget

Defined in: [signer.ts:29](https://github.com/TuwaIO/siwx/blob/main/packages/siwx-solana/src/signer.ts#L29)

A Wallet Standard wallet and the account to sign with. The wallet must provide the `solana:signMessage` feature.

## Properties

### account

> **account**: `WalletAccount`

Defined in: [signer.ts:33](https://github.com/TuwaIO/siwx/blob/main/packages/siwx-solana/src/signer.ts#L33)

The connected account, one of `wallet.accounts`. Its `address` identifies the signature.

***

### wallet

> **wallet**: `Wallet`

Defined in: [signer.ts:31](https://github.com/TuwaIO/siwx/blob/main/packages/siwx-solana/src/signer.ts#L31)

The Wallet Standard wallet.
