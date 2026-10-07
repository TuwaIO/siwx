# EvmVerifyClient

> **EvmVerifyClient** = `Client`\<`Transport`, `Chain` \| `undefined`\>

Defined in: [siwx-evm/src/types.ts:12](https://github.com/TuwaIO/siwx/blob/main/packages/siwx-evm/src/types.ts#L12)

A viem client that reads a chain, such as the result of `createPublicClient`. Typed as viem's base `Client`, so the
clients of chains with their own formatters (OP Stack chains like Base and Optimism, zkSync, Celo) fit as well.
