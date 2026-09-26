# SiwxSessionLike

Defined in: [validateMessage.ts:341](https://github.com/TuwaIO/siwx/blob/main/packages/siwx-core/src/validateMessage.ts#L341)

Minimal shape of a SIWX session or parsed CAIP-122 message accepted by [isSessionMatchingTarget](/packages/siwx-core/functions/isSessionMatchingTarget.md).

## Properties

### address

> **address**: `string`

Defined in: [validateMessage.ts:343](https://github.com/TuwaIO/siwx/blob/main/packages/siwx-core/src/validateMessage.ts#L343)

CAIP-10 account ID of the session, e.g. `eip155:1:0xAb58…`.

***

### chainId?

> `optional` **chainId?**: `string`

Defined in: [validateMessage.ts:345](https://github.com/TuwaIO/siwx/blob/main/packages/siwx-core/src/validateMessage.ts#L345)

CAIP-2 chain ID of the session, e.g. `eip155:1`.
