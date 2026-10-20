# SolanaLegacyMessageSigner

Defined in: [signer.ts:52](https://github.com/TuwaIO/siwx/blob/main/packages/siwx-solana/src/signer.ts#L52)

A legacy wallet adapter (for example from `@solana/wallet-adapter-react`) that signs raw message bytes.

## Methods

### signMessage()

> **signMessage**(`message`): `Promise`\<`Uint8Array`\<`ArrayBufferLike`\> \| \{ `signature`: `Uint8Array`; \}\>

Defined in: [signer.ts:58](https://github.com/TuwaIO/siwx/blob/main/packages/siwx-solana/src/signer.ts#L58)

Signs the message bytes.

#### Parameters

##### message

`Uint8Array`

UTF-8 bytes of the message.

#### Returns

`Promise`\<`Uint8Array`\<`ArrayBufferLike`\> \| \{ `signature`: `Uint8Array`; \}\>

The 64-byte ed25519 signature, or an object that contains it.
