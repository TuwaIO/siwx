# UseSiwxSignInOptions

Defined in: [siwx-react/src/hooks.ts:15](https://github.com/TuwaIO/siwx/blob/main/packages/siwx-react/src/hooks.ts#L15)

Options of `signIn` returned by [useSiwx](/packages/siwx-react/functions/useSiwx.md).

## Properties

### fields

> **fields**: `Omit`\<[`SiwxMessageFields`](/packages/siwx-react/interfaces/SiwxMessageFields.md), `"version"` \| `"nonce"` \| `"issuedAt"`\> & `object`

Defined in: [siwx-react/src/hooks.ts:39](https://github.com/TuwaIO/siwx/blob/main/packages/siwx-react/src/hooks.ts#L39)

Fields of the CAIP-122 message. `version` is always `"1"`. When omitted, `nonce` comes from `getNonce` (or
`generateNonce` from `@tuwaio/siwx-core`), `issuedAt` is the current time and `expirationTime` is 24 hours later.

#### Type Declaration

##### issuedAt?

> `optional` **issuedAt?**: `string`

##### nonce?

> `optional` **nonce?**: `string`

***

### getNonce?

> `optional` **getNonce?**: () => `Promise`\<`string`\> \| `string`

Defined in: [siwx-react/src/hooks.ts:51](https://github.com/TuwaIO/siwx/blob/main/packages/siwx-react/src/hooks.ts#L51)

Fetches a challenge nonce from the backend (for example `GET /api/siwx/nonce`). Used when `fields.nonce` is
omitted; without it, the nonce is generated in the browser, which servers that only accept nonces they issued
(such as both handlers of `@tuwaio/siwx-server/next`) reject.

#### Returns

`Promise`\<`string`\> \| `string`

The nonce, or a promise resolving to it.

***

### onError?

> `optional` **onError?**: (`error`) => `void`

Defined in: [siwx-react/src/hooks.ts:65](https://github.com/TuwaIO/siwx/blob/main/packages/siwx-react/src/hooks.ts#L65)

Called when any step (nonce, signing, verification) fails, after the store has been set to `error`.

#### Parameters

##### error

`string`

The error message.

#### Returns

`void`

***

### onSuccess?

> `optional` **onSuccess?**: (`session`) => `void`

Defined in: [siwx-react/src/hooks.ts:58](https://github.com/TuwaIO/siwx/blob/main/packages/siwx-react/src/hooks.ts#L58)

Called after the store has been set to `authenticated`.

#### Parameters

##### session

[`SiwxClientSession`](/packages/siwx-react/interfaces/SiwxClientSession.md)

The verified session returned by `verifier`.

#### Returns

`void`

***

### signer

> **signer**: (`message`) => `Promise`\<`string`\>

Defined in: [siwx-react/src/hooks.ts:23](https://github.com/TuwaIO/siwx/blob/main/packages/siwx-react/src/hooks.ts#L23)

Signs the CAIP-122 message with the connected wallet, for example `createEvmSiwxSigner` from
`@tuwaio/siwx-evm` or `createSolanaSiwxSigner` from `@tuwaio/siwx-solana`.

#### Parameters

##### message

`string`

The CAIP-122 message to sign.

#### Returns

`Promise`\<`string`\>

A promise resolving to the signature (hex for EVM, base58 for Solana).

***

### verifier

> **verifier**: (`payload`) => `Promise`\<[`SiwxClientSession`](/packages/siwx-react/interfaces/SiwxClientSession.md) \| `null`\>

Defined in: [siwx-react/src/hooks.ts:33](https://github.com/TuwaIO/siwx/blob/main/packages/siwx-react/src/hooks.ts#L33)

Sends the signed message to your backend, which verifies it and issues the session (for example
`POST /api/siwx/verify` of `@tuwaio/siwx-server/next`, which responds with the session JSON).

#### Parameters

##### payload

The message and signature to submit.

###### message

`string`

###### signature

`string`

#### Returns

`Promise`\<[`SiwxClientSession`](/packages/siwx-react/interfaces/SiwxClientSession.md) \| `null`\>

A promise resolving to the verified session, or `null` when verification failed. Throwing also counts
as a failure.
