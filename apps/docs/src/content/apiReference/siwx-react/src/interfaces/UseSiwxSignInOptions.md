[**API Reference — @tuwaio/siwx (CAIP-122 Authentication Layer)**](../../../README.md)

***

# UseSiwxSignInOptions

Defined in: [packages/siwx-react/src/hooks.ts:15](https://github.com/TuwaIO/siwx/blob/fcaa3a6f9f1375901c6bae0f335f995349246d8e/packages/siwx-react/src/hooks.ts#L15)

Options for the `useSiwx` hook's `signIn` function.

## Properties

### fields

> **fields**: `Omit`\<[`SiwxMessageFields`](SiwxMessageFields.md), `"version"` \| `"nonce"` \| `"issuedAt"`\> & `object`

Defined in: [packages/siwx-react/src/hooks.ts:39](https://github.com/TuwaIO/siwx/blob/fcaa3a6f9f1375901c6bae0f335f995349246d8e/packages/siwx-react/src/hooks.ts#L39)

The fields to build the CAIP-122 message with.
`nonce` and `issuedAt` are auto-generated if not provided.

#### Type Declaration

##### issuedAt?

> `optional` **issuedAt?**: `string`

##### nonce?

> `optional` **nonce?**: `string`

***

### onError?

> `optional` **onError?**: (`error`) => `void`

Defined in: [packages/siwx-react/src/hooks.ts:56](https://github.com/TuwaIO/siwx/blob/fcaa3a6f9f1375901c6bae0f335f995349246d8e/packages/siwx-react/src/hooks.ts#L56)

Optional callback triggered if signing or verification fails.

#### Parameters

##### error

`string`

The error message string.

#### Returns

`void`

***

### onSuccess?

> `optional` **onSuccess?**: (`session`) => `void`

Defined in: [packages/siwx-react/src/hooks.ts:49](https://github.com/TuwaIO/siwx/blob/fcaa3a6f9f1375901c6bae0f335f995349246d8e/packages/siwx-react/src/hooks.ts#L49)

Optional callback triggered immediately after successful authentication.

#### Parameters

##### session

[`SiwxClientSession`](SiwxClientSession.md)

The authenticated client session object.

#### Returns

`void`

***

### signer

> **signer**: (`message`) => `Promise`\<`string`\>

Defined in: [packages/siwx-react/src/hooks.ts:23](https://github.com/TuwaIO/siwx/blob/fcaa3a6f9f1375901c6bae0f335f995349246d8e/packages/siwx-react/src/hooks.ts#L23)

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

Defined in: [packages/siwx-react/src/hooks.ts:33](https://github.com/TuwaIO/siwx/blob/fcaa3a6f9f1375901c6bae0f335f995349246d8e/packages/siwx-react/src/hooks.ts#L33)

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
