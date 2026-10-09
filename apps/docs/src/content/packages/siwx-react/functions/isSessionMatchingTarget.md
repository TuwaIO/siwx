# isSessionMatchingTarget()

> **isSessionMatchingTarget**(`session`, `targetAddress`, `targetChainId?`): `boolean`

Defined in: [siwx-core/src/validateMessage.ts:379](https://github.com/TuwaIO/siwx/blob/main/packages/siwx-core/src/validateMessage.ts#L379)

Checks whether a SIWX session belongs to a given wallet address and, optionally, chain. Use it on the server to
make sure the signed-in account is the one a request acts on.

The session account is read with `parseCaip10AccountId` of `@tuwaio/orbit-core`; a session whose account is not a
valid `eip155` or `solana` CAIP-10 account ID never matches. A CAIP-10 target must have the session's namespace (any
of its chains); a plain target that starts with `0x` only matches `eip155:` sessions, any other plain target only
`solana:` sessions. EVM accounts are compared case-insensitively, Solana accounts case-sensitively. The chain is
compared only when `targetChainId` is given and the session has a `chainId`; a Solana cluster matches under its name
(`devnet`, `solana:devnet`) and its genesis-hash chain ID (see [normalizeSolanaChainId](/packages/siwx-core/functions/normalizeSolanaChainId.md)).

## Parameters

### session

[`SiwxSessionLike`](/packages/siwx-react/interfaces/SiwxSessionLike.md) \| `null` \| `undefined`

The session or parsed message to check. `null` and `undefined` never match.

### targetAddress

`string`

The expected account, as a plain address or a CAIP-10 account ID.

### targetChainId?

`string` \| `number`

Optional expected chain, as a chain reference (`1`, `'1'`) or a CAIP-2 ID (`'eip155:1'`).

## Returns

`boolean`

`true` if the session matches the address and, when given, the chain; otherwise `false`.

## Example

```ts
const session = { address: 'eip155:1:0xAb5801a7D398351b8bE11C439e05C5B3259aeC9B', chainId: 'eip155:1' };

isSessionMatchingTarget(session, '0xab5801a7d398351b8be11c439e05c5b3259aec9b', 1); // true
isSessionMatchingTarget(session, '0xAb5801a7D398351b8bE11C439e05C5B3259aeC9B', 'eip155:10'); // false
```
