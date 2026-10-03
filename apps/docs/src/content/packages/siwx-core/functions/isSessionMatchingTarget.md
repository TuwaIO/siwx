# isSessionMatchingTarget()

> **isSessionMatchingTarget**(`session`, `targetAddress`, `targetChainId?`): `boolean`

Defined in: [validateMessage.ts:370](https://github.com/TuwaIO/siwx/blob/main/packages/siwx-core/src/validateMessage.ts#L370)

Checks whether a SIWX session belongs to a given wallet address and, optionally, chain. Use it on the server to
make sure the signed-in account is the one a request acts on.

A target that starts with `0x` or `eip155:` is treated as EVM and only matches `eip155:` sessions, compared
case-insensitively; any other target only matches `solana:` sessions, compared case-sensitively. The chain is
compared only when `targetChainId` is given and the session has a `chainId`; a Solana cluster matches under its name
(`devnet`, `solana:devnet`) and its genesis-hash chain ID (see [normalizeSolanaChainId](/packages/siwx-core/functions/normalizeSolanaChainId.md)).

## Parameters

### session

[`SiwxSessionLike`](/packages/siwx-core/interfaces/SiwxSessionLike.md) \| `null` \| `undefined`

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
