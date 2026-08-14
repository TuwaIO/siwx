[**API Reference — @tuwaio/siwx (CAIP-122 Authentication Layer)**](../../../README.md)

***

# isSessionMatchingTarget()

> **isSessionMatchingTarget**(`session`, `targetAddress`, `targetChainId?`): `boolean`

Defined in: [packages/siwx-core/src/validateMessage.ts:336](https://github.com/TuwaIO/siwx/blob/bbc740ccb7f405b75bd0d4e5a1bc973b1e131514/packages/siwx-core/src/validateMessage.ts#L336)

Validates whether a SIWX session matches a target wallet address and optional chainId.
Handles EVM case-insensitivity, Solana case-sensitivity, and CAIP-10/CAIP-2 normalization.

## Parameters

### session

[`SiwxSessionLike`](../interfaces/SiwxSessionLike.md) \| `null` \| `undefined`

Active SIWX session or parsed message

### targetAddress

`string`

Target account address (plain or CAIP-10)

### targetChainId?

`string` \| `number`

Target chain reference or CAIP-2 identifier

## Returns

`boolean`

True if the session matches the target address and chainId; false otherwise.

## Example

```ts
const isValid = isSessionMatchingTarget(session, '0x123...', 1);
```
