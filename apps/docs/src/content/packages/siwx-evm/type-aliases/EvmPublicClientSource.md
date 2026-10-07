# EvmPublicClientSource

> **EvmPublicClientSource** = [`EvmVerifyClient`](/packages/siwx-evm/type-aliases/EvmVerifyClient.md) \| ((`chainId`) => [`EvmVerifyClient`](/packages/siwx-evm/type-aliases/EvmVerifyClient.md) \| `undefined` \| `Promise`\<[`EvmVerifyClient`](/packages/siwx-evm/type-aliases/EvmVerifyClient.md) \| `undefined`\>)

Defined in: [siwx-evm/src/types.ts:20](https://github.com/TuwaIO/siwx/blob/main/packages/siwx-evm/src/types.ts#L20)

Where the EVM verifiers get the client that checks smart contract wallet signatures: one client, or a function that
returns the client of an EVM chain by its chain number (`8453`), or `undefined` when the app has no client for that
chain. Use the function form when users sign in on more than one chain: a contract wallet can only be checked on
the chain it signed for.
