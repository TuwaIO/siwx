# ServerVerifyOptions

Defined in: [siwx-server/src/types.ts:11](https://github.com/TuwaIO/siwx/blob/main/packages/siwx-server/src/types.ts#L11)

Options of [verifySiwxPayload](/packages/siwx-server/server/functions/verifySiwxPayload.md).

## Properties

### policy?

> `optional` **policy?**: [`SiwxVerificationPolicy`](/packages/siwx-server/server/interfaces/SiwxVerificationPolicy.md)

Defined in: [siwx-server/src/types.ts:29](https://github.com/TuwaIO/siwx/blob/main/packages/siwx-server/src/types.ts#L29)

Verification policy enforced on the message fields (domain, URI, chains, timing). See
[SiwxVerificationPolicy](/packages/siwx-server/server/interfaces/SiwxVerificationPolicy.md).

***

### publicClient?

> `optional` **publicClient?**: `PublicClient`

Defined in: [siwx-server/src/types.ts:35](https://github.com/TuwaIO/siwx/blob/main/packages/siwx-server/src/types.ts#L35)

viem `PublicClient` for the chain of the message. Enables the EIP-1271 (smart contract wallet) fallback for
`eip155` messages; ignored for Solana.

***

### skipExpiration?

> `optional` **skipExpiration?**: `boolean`

Defined in: [siwx-server/src/types.ts:23](https://github.com/TuwaIO/siwx/blob/main/packages/siwx-server/src/types.ts#L23)

Skips the check that the message `expirationTime` has not passed. Not recommended in production.

#### Default

```ts
false
```

***

### usedNonces?

> `optional` **usedNonces?**: `Set`\<`string`\>

Defined in: [siwx-server/src/types.ts:17](https://github.com/TuwaIO/siwx/blob/main/packages/siwx-server/src/types.ts#L17)

Nonces that must be rejected. Verification fails when the message nonce is in the set. The set is only read:
record used nonces yourself, or use a [SiwxNonceStore](/packages/siwx-server/server/interfaces/SiwxNonceStore.md) (as `createSiwxApiHandler` does) for
multi-instance deployments.
