# SiwxSessionLike

Defined in: [siwx-core/src/validateMessage.ts:348](https://github.com/TuwaIO/siwx/blob/main/packages/siwx-core/src/validateMessage.ts#L348)

Minimal shape of a SIWX session or parsed CAIP-122 message accepted by [isSessionMatchingTarget](/packages/siwx-react/functions/isSessionMatchingTarget.md).

## Properties

### address

> **address**: `string`

Defined in: [siwx-core/src/validateMessage.ts:350](https://github.com/TuwaIO/siwx/blob/main/packages/siwx-core/src/validateMessage.ts#L350)

CAIP-10 account ID of the session, e.g. `eip155:1:0xAb58…`.

***

### chainId?

> `optional` **chainId?**: `string`

Defined in: [siwx-core/src/validateMessage.ts:352](https://github.com/TuwaIO/siwx/blob/main/packages/siwx-core/src/validateMessage.ts#L352)

CAIP-2 chain ID of the session, e.g. `eip155:1`.
