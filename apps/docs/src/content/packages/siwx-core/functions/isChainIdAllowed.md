# isChainIdAllowed()

> **isChainIdAllowed**(`chainId`, `allowedChainIds?`): `boolean`

Defined in: [solanaChainId.ts:54](https://github.com/TuwaIO/siwx/blob/main/packages/siwx-core/src/solanaChainId.ts#L54)

Checks a chain ID against the `allowedChainIds` of a verification policy. Chain IDs must match exactly, so `eip155:1`
never allows `solana:1` or a bare `1`; the only exception is a Solana cluster, which matches under its name and its
genesis-hash chain ID (see [normalizeSolanaChainId](/packages/siwx-core/functions/normalizeSolanaChainId.md)).

## Parameters

### chainId

`string`

The CAIP-2 chain ID of a message or session.

### allowedChainIds?

readonly `string`[]

The allowed CAIP-2 chain IDs. Missing or empty allows every chain.

## Returns

`boolean`

`true` when the chain is allowed.

## Example

```ts
isChainIdAllowed('solana:EtWTRABZaYq6iMfeYKouRu166VU2xqa1', ['solana:devnet']); // true
isChainIdAllowed('eip155:1', ['eip155:8453']); // false
```
