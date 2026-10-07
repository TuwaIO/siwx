# SiwxSessionLike

Defined in: [validateMessage.ts:338](https://github.com/TuwaIO/siwx/blob/main/packages/siwx-core/src/validateMessage.ts#L338)

Minimal shape of a SIWX session or parsed CAIP-122 message accepted by [isSessionMatchingTarget](/packages/siwx-core/functions/isSessionMatchingTarget.md).

## Properties

### address

> **address**: `string`

Defined in: [validateMessage.ts:340](https://github.com/TuwaIO/siwx/blob/main/packages/siwx-core/src/validateMessage.ts#L340)

CAIP-10 account ID of the session, e.g. `eip155:1:0xAb58…`.

***

### chainId?

> `optional` **chainId?**: `string`

Defined in: [validateMessage.ts:342](https://github.com/TuwaIO/siwx/blob/main/packages/siwx-core/src/validateMessage.ts#L342)

CAIP-2 chain ID of the session, e.g. `eip155:1`.
