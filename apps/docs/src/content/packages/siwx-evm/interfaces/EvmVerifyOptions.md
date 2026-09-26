# EvmVerifyOptions

Defined in: [siwx-evm/src/types.ts:11](https://github.com/TuwaIO/siwx/blob/main/packages/siwx-evm/src/types.ts#L11)

Options of the EVM verifiers ([verifyEvmSignature](/packages/siwx-evm/functions/verifyEvmSignature.md), [verifyEip191](/packages/siwx-evm/functions/verifyEip191.md), [verifyEip1271](/packages/siwx-evm/functions/verifyEip1271.md)).

## Properties

### publicClient?

> `optional` **publicClient?**: `PublicClient`

Defined in: [siwx-evm/src/types.ts:17](https://github.com/TuwaIO/siwx/blob/main/packages/siwx-evm/src/types.ts#L17)

viem `PublicClient` connected to the chain of the message. Required by [verifyEip1271](/packages/siwx-evm/functions/verifyEip1271.md); without it,
[verifyEvmSignature](/packages/siwx-evm/functions/verifyEvmSignature.md) only performs EIP-191 (EOA) verification. The verifiers do not check that the
client's chain matches the message `chainId`.

***

### skipExpiration?

> `optional` **skipExpiration?**: `boolean`

Defined in: [siwx-evm/src/types.ts:23](https://github.com/TuwaIO/siwx/blob/main/packages/siwx-evm/src/types.ts#L23)

Skips the check that the message `expirationTime` has not passed.

#### Default

```ts
false
```
