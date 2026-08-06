[**API Reference — @tuwaio/siwx (CAIP-122 Authentication Layer)**](../../../README.md)

***

# ServerVerifyOptions

Defined in: [packages/siwx-server/src/types.ts:10](https://github.com/TuwaIO/siwx/blob/f3976975efb71bc20b6908e4a2785aadb8b7e132/packages/siwx-server/src/types.ts#L10)

Options for the `verifySiwxPayload` function.

## Properties

### publicClient?

> `optional` **publicClient?**: `any`

Defined in: [packages/siwx-server/src/types.ts:29](https://github.com/TuwaIO/siwx/blob/f3976975efb71bc20b6908e4a2785aadb8b7e132/packages/siwx-server/src/types.ts#L29)

Optional viem `PublicClient` instance for EVM chain EIP-1271 (smart contract wallet) verification.

***

### skipExpiration?

> `optional` **skipExpiration?**: `boolean`

Defined in: [packages/siwx-server/src/types.ts:23](https://github.com/TuwaIO/siwx/blob/f3976975efb71bc20b6908e4a2785aadb8b7e132/packages/siwx-server/src/types.ts#L23)

If true, skips the `expirationTime` validation check.
Not recommended for production use.

#### Default

```ts
false
```

***

### usedNonces?

> `optional` **usedNonces?**: `Set`\<`string`\>

Defined in: [packages/siwx-server/src/types.ts:16](https://github.com/TuwaIO/siwx/blob/f3976975efb71bc20b6908e4a2785aadb8b7e132/packages/siwx-server/src/types.ts#L16)

A set of nonces that have already been used.
If the payload's nonce is found in this set, verification will fail
to prevent replay attacks. You should populate this from your session store or cache.
