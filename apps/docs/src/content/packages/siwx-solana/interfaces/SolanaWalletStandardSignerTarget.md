# SolanaWalletStandardSignerTarget

Defined in: [signer.ts:42](https://github.com/TuwaIO/siwx/blob/main/packages/siwx-solana/src/signer.ts#L42)

A Wallet Standard wallet and the account to sign with. The wallet must provide the `solana:signMessage` feature,
or `solana:signOffchainMessage` (see [SolanaSiwxMessageFormat](/packages/siwx-solana/type-aliases/SolanaSiwxMessageFormat.md)).

## Properties

### account

> **account**: `WalletAccount`

Defined in: [signer.ts:46](https://github.com/TuwaIO/siwx/blob/main/packages/siwx-solana/src/signer.ts#L46)

The connected account, one of `wallet.accounts`. Its `address` identifies the signature.

***

### wallet

> **wallet**: `Wallet`

Defined in: [signer.ts:44](https://github.com/TuwaIO/siwx/blob/main/packages/siwx-solana/src/signer.ts#L44)

The Wallet Standard wallet.
