# SolanaWalletStandardSignerTarget

Defined in: [signer.ts:81](https://github.com/TuwaIO/siwx/blob/main/packages/siwx-solana/src/signer.ts#L81)

A Wallet Standard wallet and the account to sign with. The wallet must provide the `solana:signMessage` feature,
or `solana:signOffchainMessage` (see [SolanaSiwxMessageFormat](/packages/siwx-solana/type-aliases/SolanaSiwxMessageFormat.md)).

## Properties

### account

> **account**: `WalletAccount`

Defined in: [signer.ts:85](https://github.com/TuwaIO/siwx/blob/main/packages/siwx-solana/src/signer.ts#L85)

The connected account, one of `wallet.accounts`. Its `address` identifies the signature.

***

### wallet

> **wallet**: `Wallet`

Defined in: [signer.ts:83](https://github.com/TuwaIO/siwx/blob/main/packages/siwx-solana/src/signer.ts#L83)

The Wallet Standard wallet.
