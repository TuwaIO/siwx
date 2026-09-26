# createEvmSiwxSigner()

> **createEvmSiwxSigner**(`target`, `account?`): (`message`) => `Promise`\<`string`\>

Defined in: [siwx-evm/src/signer.ts:33](https://github.com/TuwaIO/siwx/blob/main/packages/siwx-evm/src/signer.ts#L33)

Creates a SIWX signer for EVM wallets: a function that signs a message with EIP-191 `personal_sign` and returns
the hex signature. Pass it as `signer` to `useSiwx().signIn` from `@tuwaio/siwx-react`.

A wagmi `Config` (detected by its `state` and `connectors` properties) is signed with `signMessage` from
`@wagmi/core`; anything else is treated as a viem `WalletClient`.

## Parameters

### target

[`EvmSiwxSignerTarget`](/packages/siwx-evm/type-aliases/EvmSiwxSignerTarget.md)

A wagmi `Config` or a viem `WalletClient`.

### account?

`` `0x${string}` ``

Account to sign with. Defaults to the active wagmi account, or to the `WalletClient` account.

## Returns

An async signer. Calling it opens the wallet signature prompt; it rejects with an `Error` whose message
starts with `[SIWX-EVM] Signing failed:` (original error in `cause`) when signing fails or no account is
available.

(`message`) => `Promise`\<`string`\>

## Example

```ts
const signer = createEvmSiwxSigner(wagmiConfig);
const signature = await signer(message);
```
