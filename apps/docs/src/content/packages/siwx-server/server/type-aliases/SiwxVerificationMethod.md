# SiwxVerificationMethod

> **SiwxVerificationMethod** = `"eip191"` \| `"eip1271"` \| `"erc6492"` \| `"ed25519"`

Defined in: [siwx-server/src/types.ts:51](https://github.com/TuwaIO/siwx/blob/main/packages/siwx-server/src/types.ts#L51)

How a signature was verified:

- `eip191`: by the key of an EVM account, which controls the address on every chain;
- `eip1271`: by a deployed EVM smart contract wallet, on the chain it signed on;
- `erc6492`: by an EVM smart contract wallet that is not deployed yet, on the chain it signed on;
- `ed25519`: by the key of a Solana account.

A smart contract wallet is controlled on each chain separately: the same address can have other owners on another
network.
