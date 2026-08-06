[**API Reference — @tuwaio/siwx (CAIP-122 Authentication Layer)**](../../../README.md)

***

# UseSiwxSignInOptions

Defined in: [packages/siwx-react/src/hooks.ts:15](https://github.com/TuwaIO/siwx/blob/b9b124994d5ac633a6d509fd0c9a5e5efdaac504/packages/siwx-react/src/hooks.ts#L15)

Options for the `useSiwx` hook's `signIn` function.

## Properties

### fields

> **fields**: `Omit`\<`SiwxMessageFields`, `"version"` \| `"nonce"` \| `"issuedAt"`\> & `object`

Defined in: [packages/siwx-react/src/hooks.ts:39](https://github.com/TuwaIO/siwx/blob/b9b124994d5ac633a6d509fd0c9a5e5efdaac504/packages/siwx-react/src/hooks.ts#L39)

The fields to build the CAIP-122 message with.
`nonce` and `issuedAt` are auto-generated if not provided.

#### Type Declaration

##### issuedAt?

> `optional` **issuedAt?**: `string`

##### nonce?

> `optional` **nonce?**: `string`

***

### signer

> **signer**: (`message`) => `Promise`\<`string`\>

Defined in: [packages/siwx-react/src/hooks.ts:23](https://github.com/TuwaIO/siwx/blob/b9b124994d5ac633a6d509fd0c9a5e5efdaac504/packages/siwx-react/src/hooks.ts#L23)

A function that accepts the formatted CAIP-122 message string and returns the signature.
This is where you integrate with your wallet connector (e.g., satellite, wagmi, gill).

#### Parameters

##### message

`string`

The formatted CAIP-122 message ready for signing.

#### Returns

`Promise`\<`string`\>

A promise resolving to the hex/base58-encoded signature string.

***

### verifier

> **verifier**: (`payload`) => `Promise`\<[`SiwxClientSession`](SiwxClientSession.md) \| `null`\>

Defined in: [packages/siwx-react/src/hooks.ts:33](https://github.com/TuwaIO/siwx/blob/b9b124994d5ac633a6d509fd0c9a5e5efdaac504/packages/siwx-react/src/hooks.ts#L33)

A function that submits the `{ message, signature }` payload to your backend
for verification and issues a session (cookie/JWT).
The function should return the parsed session on success.

#### Parameters

##### payload

The message and signature to submit.

###### message

`string`

###### signature

`string`

#### Returns

`Promise`\<[`SiwxClientSession`](SiwxClientSession.md) \| `null`\>

A promise resolving to the session, or throwing/returning null on failure.
