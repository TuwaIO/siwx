# createSolanaSiwxSigner()

> **createSolanaSiwxSigner**(`target`, `options?`): (`message`) => `Promise`\<`string`\>

Defined in: [signer.ts:425](https://github.com/TuwaIO/siwx/blob/main/packages/siwx-solana/src/signer.ts#L425)

Creates a SIWX signer for Solana wallets: a function that signs a message with the wallet and returns the ed25519
signature as a base58 string. Pass it as `signer` to `useSiwx().signIn` from `@tuwaio/siwx-react`.

Works with Wallet Standard wallets, `@solana/kit` message signers, legacy adapters and `useWallet()` of
`@solana/wallet-adapter`; see [SolanaSiwxSignerTarget](/packages/siwx-solana/type-aliases/SolanaSiwxSignerTarget.md) for how the signing method is chosen. The wallet signs
the UTF-8 bytes of the message or its version 1 off-chain message (which hardware wallets can show and sign), as
`options.messageFormat` decides ([SolanaSiwxMessageFormat](/packages/siwx-solana/type-aliases/SolanaSiwxMessageFormat.md)); servers verify both.

## Parameters

### target

[`SolanaSiwxSignerTarget`](/packages/siwx-solana/type-aliases/SolanaSiwxSignerTarget.md)

The Wallet Standard wallet and account, an `@solana/kit` message signer or a legacy adapter.

### options?

[`SolanaSiwxSignerOptions`](/packages/siwx-solana/interfaces/SolanaSiwxSignerOptions.md) = `{}`

`messageFormat`: `'auto'` (default), `'message'` or `'offchainMessage'`.

## Returns

An async signer. Calling it opens the wallet signature prompt; it rejects with an `Error` whose message
starts with `[SIWX-SOLANA] Signing failed:` (original error in `cause`) when the target has no signing
capability, the wallet rejects, cannot sign version 1 off-chain messages or signs a different off-chain message, or
no signature is returned for the account address.

(`message`) => `Promise`\<`string`\>

## Example

```ts
const signer = createSolanaSiwxSigner({ wallet, account });
const signature = await signer(message);
```
