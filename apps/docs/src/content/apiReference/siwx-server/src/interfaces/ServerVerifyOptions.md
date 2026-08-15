[**API Reference — @tuwaio/siwx (CAIP-122 Authentication Layer)**](../../../README.md)

***

# ServerVerifyOptions

Defined in: [packages/siwx-server/src/types.ts:10](https://github.com/TuwaIO/siwx/blob/0ca0708dd74b07eb7d1d46e0b3ebb6c65b68bbc8/packages/siwx-server/src/types.ts#L10)

Options for the `verifySiwxPayload` function.

## Properties

### policy?

> `optional` **policy?**: [`SiwxVerificationPolicy`](SiwxVerificationPolicy.md)

Defined in: [packages/siwx-server/src/types.ts:28](https://github.com/TuwaIO/siwx/blob/0ca0708dd74b07eb7d1d46e0b3ebb6c65b68bbc8/packages/siwx-server/src/types.ts#L28)

Optional verification policy to enforce on the message fields.

***

### publicClient?

> `optional` **publicClient?**: `any`

Defined in: [packages/siwx-server/src/types.ts:34](https://github.com/TuwaIO/siwx/blob/0ca0708dd74b07eb7d1d46e0b3ebb6c65b68bbc8/packages/siwx-server/src/types.ts#L34)

Optional viem `PublicClient` instance for EVM chain EIP-1271 (smart contract wallet) verification.

***

### skipExpiration?

> `optional` **skipExpiration?**: `boolean`

Defined in: [packages/siwx-server/src/types.ts:23](https://github.com/TuwaIO/siwx/blob/0ca0708dd74b07eb7d1d46e0b3ebb6c65b68bbc8/packages/siwx-server/src/types.ts#L23)

If true, skips the `expirationTime` validation check.
Not recommended for production use.

#### Default

```ts
false
```

***

### usedNonces?

> `optional` **usedNonces?**: `Set`\<`string`\>

Defined in: [packages/siwx-server/src/types.ts:16](https://github.com/TuwaIO/siwx/blob/0ca0708dd74b07eb7d1d46e0b3ebb6c65b68bbc8/packages/siwx-server/src/types.ts#L16)

A set of nonces that have already been used.
If the payload's nonce is found in this set, verification will fail
to prevent replay attacks.
