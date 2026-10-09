# SolanaSiwxMessageFormat

> **SolanaSiwxMessageFormat** = `"auto"` \| `"message"` \| `"offchainMessage"`

Defined in: [signer.ts:67](https://github.com/TuwaIO/siwx/blob/main/packages/siwx-solana/src/signer.ts#L67)

How [createSolanaSiwxSigner](/packages/siwx-solana/functions/createSolanaSiwxSigner.md) has the wallet sign the message:

- `'auto'` (default): the UTF-8 bytes of the message, or its version 1 off-chain message when the account supports
  `solana:signOffchainMessage` but not `solana:signMessage` (as hardware wallet accounts may), or when the target
  has no other way to sign;
- `'message'`: always the UTF-8 bytes (`solana:signMessage` and the fallbacks of [SolanaSiwxSignerTarget](/packages/siwx-solana/type-aliases/SolanaSiwxSignerTarget.md));
- `'offchainMessage'`: always the version 1 off-chain message (`solana:signOffchainMessage`, or a
  `signOffchainMessage(message)` method such as the one of `useWallet()` from `@solana/wallet-adapter` v3).

`verifyEd25519` and `@tuwaio/siwx-server` accept both, so the format needs no server setting.
