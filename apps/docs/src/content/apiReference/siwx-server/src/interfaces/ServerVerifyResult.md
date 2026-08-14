[**API Reference — @tuwaio/siwx (CAIP-122 Authentication Layer)**](../../../README.md)

***

# ServerVerifyResult

Defined in: [packages/siwx-server/src/types.ts:41](https://github.com/TuwaIO/siwx/blob/bbc740ccb7f405b75bd0d4e5a1bc973b1e131514/packages/siwx-server/src/types.ts#L41)

The result of a server-side verification operation, extending the base result
with the verification method used.

## Extends

- `SiwxVerifyResult`

## Properties

### data?

> `optional` **data?**: [`SiwxMessageFields`](../../../siwx-react/src/interfaces/SiwxMessageFields.md)

Defined in: packages/siwx-core/dist/index.d.ts:173

The parsed message fields if verification succeeded.
Present only when `success` is true.

#### Inherited from

`SiwxVerifyResult.data`

***

### error?

> `optional` **error?**: `string`

Defined in: packages/siwx-core/dist/index.d.ts:178

A human-readable error if verification failed.
Present only when `success` is false.

#### Inherited from

`SiwxVerifyResult.error`

***

### namespace?

> `optional` **namespace?**: `"eip155"` \| `"solana"`

Defined in: [packages/siwx-server/src/types.ts:46](https://github.com/TuwaIO/siwx/blob/bbc740ccb7f405b75bd0d4e5a1bc973b1e131514/packages/siwx-server/src/types.ts#L46)

The CAIP-2 namespace used for verification routing.
`eip155` for EVM chains, `solana` for Solana.

***

### success

> **success**: `boolean`

Defined in: packages/siwx-core/dist/index.d.ts:168

Whether the signature is valid and the message is authentic.

#### Inherited from

`SiwxVerifyResult.success`
