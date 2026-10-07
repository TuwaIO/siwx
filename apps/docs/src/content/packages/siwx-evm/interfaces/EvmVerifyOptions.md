# EvmVerifyOptions

Defined in: [siwx-evm/src/types.ts:26](https://github.com/TuwaIO/siwx/blob/main/packages/siwx-evm/src/types.ts#L26)

Options of the EVM verifiers ([verifyEvmSignature](/packages/siwx-evm/functions/verifyEvmSignature.md), [verifyEip191](/packages/siwx-evm/functions/verifyEip191.md), [verifyEip1271](/packages/siwx-evm/functions/verifyEip1271.md)).

## Properties

### publicClient?

> `optional` **publicClient?**: [`EvmPublicClientSource`](/packages/siwx-evm/type-aliases/EvmPublicClientSource.md)

Defined in: [siwx-evm/src/types.ts:35](https://github.com/TuwaIO/siwx/blob/main/packages/siwx-evm/src/types.ts#L35)

The client that checks smart contract wallet signatures on the chain of the message: a viem client (for example
from `createPublicClient`), or a function that returns the client for a chain number (see
[EvmPublicClientSource](/packages/siwx-evm/type-aliases/EvmPublicClientSource.md)). A single client is used
only for messages of its own chain (`client.chain.id`); a client without a `chain` is used for every chain.
Required by [verifyEip1271](/packages/siwx-evm/functions/verifyEip1271.md); without it, [verifyEvmSignature](/packages/siwx-evm/functions/verifyEvmSignature.md) only performs EIP-191 (EOA)
verification.

***

### skipExpiration?

> `optional` **skipExpiration?**: `boolean`

Defined in: [siwx-evm/src/types.ts:41](https://github.com/TuwaIO/siwx/blob/main/packages/siwx-evm/src/types.ts#L41)

Skips the check that the message `expirationTime` has not passed.

#### Default

```ts
false
```
