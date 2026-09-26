# createSolanaSiwxSigner()

> **createSolanaSiwxSigner**(`target`): (`message`) => `Promise`\<`string`\>

Defined in: [signer.ts:242](https://github.com/TuwaIO/siwx/blob/main/packages/siwx-solana/src/signer.ts#L242)

Creates a SIWX signer for Solana wallets: a function that signs a message (UTF-8 bytes) with the wallet and returns
the ed25519 signature as a base58 string. Pass it as `signer` to `useSiwx().signIn` from `@tuwaio/siwx-react`.

Works with Wallet Standard wallets, `@solana/kit` message signers and legacy adapters; see
[SolanaSiwxSignerTarget](/packages/siwx-solana/type-aliases/SolanaSiwxSignerTarget.md) for how the signing method is chosen.

## Parameters

### target

[`SolanaSiwxSignerTarget`](/packages/siwx-solana/type-aliases/SolanaSiwxSignerTarget.md)

The Wallet Standard wallet and account, an `@solana/kit` message signer or a legacy adapter.

## Returns

An async signer. Calling it opens the wallet signature prompt; it rejects with an `Error` whose message
starts with `[SIWX-SOLANA] Signing failed:` (original error in `cause`) when the target has no signing
capability, the wallet rejects, or no signature is returned for the account address.

(`message`) => `Promise`\<`string`\>

## Example

```ts
const signer = createSolanaSiwxSigner({ wallet, account });
const signature = await signer(message);
```
