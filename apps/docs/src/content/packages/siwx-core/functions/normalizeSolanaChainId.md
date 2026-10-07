# normalizeSolanaChainId()

> **normalizeSolanaChainId**(`chainId`): `string`

Defined in: [solanaChainId.ts:22](https://github.com/TuwaIO/siwx/blob/main/packages/siwx-core/src/solanaChainId.ts#L22)

Returns the CAIP-2 chain ID of a public Solana cluster in the form CAIP-30 requires, the genesis hash. Wallet Standard
names (`solana:mainnet`, `solana:devnet`, `solana:testnet`), `solana:mainnet-beta` and the testnet ID from before the
testnet genesis reset become `solana:5eykt4UsFv8P8NJdTREpY1vzqKqZKvdp`, `solana:EtWTRABZaYq6iMfeYKouRu166VU2xqa1` or
`solana:4uhcVJyU9pJkvQyS88uRDiswHXSCkY3z`.

Use it to compare Solana chain IDs: sessions signed before the switch to genesis-hash IDs carry `solana:devnet`. The
cluster table is `SOLANA_CHAIN_IDS` of `@tuwaio/orbit-core`, read through its `getSolanaChainId`.

## Parameters

### chainId

`string`

A CAIP-2 chain ID.

## Returns

`string`

The genesis-hash chain ID for a known Solana cluster name; any other value unchanged (genesis-hash IDs,
`solana:localnet`, other namespaces, bare references).

## Example

```ts
normalizeSolanaChainId('solana:devnet'); // "solana:EtWTRABZaYq6iMfeYKouRu166VU2xqa1"
normalizeSolanaChainId('eip155:1'); // "eip155:1"
```
