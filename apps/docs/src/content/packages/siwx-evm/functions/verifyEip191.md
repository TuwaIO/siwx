# verifyEip191()

> **verifyEip191**(`message`, `signature`, `options?`): `Promise`\<[`EvmVerifyResult`](/packages/siwx-evm/interfaces/EvmVerifyResult.md)\>

Defined in: [siwx-evm/src/verify.ts:71](https://github.com/TuwaIO/siwx/blob/main/packages/siwx-evm/src/verify.ts#L71)

Verifies an `eip155` CAIP-122 message signed with EIP-191 (`personal_sign`) by an EOA wallet.

Parses the message, requires an `eip155` chain, runs `validateMessage` from `@tuwaio/siwx-core` (format,
expiration, `notBefore` and an `issuedAt` in the future; no policy), recovers the signer from the signature and
compares it with the message `address` case-insensitively.
Runs locally, without RPC calls. Nonce, domain and policy checks are the caller's job (see `@tuwaio/siwx-server`).

## Parameters

### message

`string`

The exact CAIP-122 message string that was signed.

### signature

`` `0x${string}` ``

The hex-encoded signature returned by the wallet.

### options?

[`EvmVerifyOptions`](/packages/siwx-evm/interfaces/EvmVerifyOptions.md) = `{}`

Verification options; only `skipExpiration` is used.

## Returns

`Promise`\<[`EvmVerifyResult`](/packages/siwx-evm/interfaces/EvmVerifyResult.md)\>

`{ success: true, data, method: 'eip191' }`, or `{ success: false, error }`. Never throws: parse,
validation and recovery errors are returned as `error`.

## Example

```ts
const result = await verifyEip191(rawMessage, '0xdeadbeef...');
if (result.success) console.log('Authenticated as:', result.data?.address);
```
