# SolanaWalletAdapterSignerTarget

Defined in: [signer.ts:108](https://github.com/TuwaIO/siwx/blob/main/packages/siwx-solana/src/signer.ts#L108)

The value of `useWallet()` from `@solana/wallet-adapter-react` (v1) or `@solana/wallet-adapter` (v3), or any other
`{ wallet, account }` objects with a signing capability, such as a wallet exposing an `adapter` or a `signMessages`
method.

Every field may be missing or `null`, as in `useWallet()` before a wallet connects: the signer looks for a signing
capability only when it is called, and rejects when it finds none.

## Properties

### account?

> `optional` **account?**: `object` \| `null`

Defined in: [signer.ts:115](https://github.com/TuwaIO/siwx/blob/main/packages/siwx-solana/src/signer.ts#L115)

The connected account. Its `address`, `publicKey` and `features` are used when present.

***

### address?

> `optional` **address?**: `string` \| `null`

Defined in: [signer.ts:117](https://github.com/TuwaIO/siwx/blob/main/packages/siwx-solana/src/signer.ts#L117)

The base58 address of the connected account (v3). Used to check the bytes of a signed off-chain message.

***

### publicKey?

> `optional` **publicKey?**: \{ `toBase58`: () => `string`; \} \| `null`

Defined in: [signer.ts:122](https://github.com/TuwaIO/siwx/blob/main/packages/siwx-solana/src/signer.ts#L122)

The public key of the connected account (`PublicKey` of `@solana/web3.js`). Used to check the bytes of a signed
off-chain message when no address is given.

***

### signMessage?

> `optional` **signMessage?**: (`message`) => `Promise`\<`Uint8Array`\<`ArrayBufferLike`\> \| \{ `signature`: `Uint8Array`; \}\>

Defined in: [signer.ts:128](https://github.com/TuwaIO/siwx/blob/main/packages/siwx-solana/src/signer.ts#L128)

Signs the UTF-8 bytes of the message.

#### Parameters

##### message

`Uint8Array`

UTF-8 bytes of the message.

#### Returns

`Promise`\<`Uint8Array`\<`ArrayBufferLike`\> \| \{ `signature`: `Uint8Array`; \}\>

The 64-byte ed25519 signature, or an object that contains it.

***

### signOffchainMessage?

> `optional` **signOffchainMessage?**: (`message`) => `Promise`\<\{ `signature`: `ReadonlyUint8Array`; `signedOffchainMessage?`: `ReadonlyUint8Array`; \}\>

Defined in: [signer.ts:134](https://github.com/TuwaIO/siwx/blob/main/packages/siwx-solana/src/signer.ts#L134)

Signs the version 1 off-chain message of the text with the connected account as its only signer (v3).

#### Parameters

##### message

`string`

The message text.

#### Returns

`Promise`\<\{ `signature`: `ReadonlyUint8Array`; `signedOffchainMessage?`: `ReadonlyUint8Array`; \}\>

The ed25519 signature and, optionally, the bytes the wallet signed.

***

### wallet?

> `optional` **wallet?**: `object` \| `null`

Defined in: [signer.ts:113](https://github.com/TuwaIO/siwx/blob/main/packages/siwx-solana/src/signer.ts#L113)

The selected wallet. Its `solana:signMessage` and `solana:signOffchainMessage` features, its `adapter` and its
`signMessages` and `signMessage` methods are used when present.
