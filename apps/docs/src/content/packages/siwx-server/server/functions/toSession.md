# toSession()

> **toSession**(`parsed`, `verificationMethod?`): [`SiwxSession`](/packages/siwx-server/server/interfaces/SiwxSession.md)

Defined in: [siwx-server/src/types.ts:426](https://github.com/TuwaIO/siwx/blob/main/packages/siwx-server/src/types.ts#L426)

Converts a verified CAIP-122 message into a [SiwxSession](/packages/siwx-server/server/interfaces/SiwxSession.md): keeps `address`, `chainId`, `domain`, `nonce`,
`issuedAt` and `expirationTime`, plus `verificationMethod` when given. Pure function.

## Parameters

### parsed

[`SiwxMessageFields`](/packages/siwx-server/server/interfaces/SiwxMessageFields.md)

The verified message, for example `result.data` of [verifySiwxPayload](/packages/siwx-server/server/functions/verifySiwxPayload.md).

### verificationMethod?

[`SiwxVerificationMethod`](/packages/siwx-server/server/type-aliases/SiwxVerificationMethod.md)

How the signature was verified: `result.method` of [verifySiwxPayload](/packages/siwx-server/server/functions/verifySiwxPayload.md). Without
it, [siwxJwtSubject](/packages/siwx-server/server/functions/siwxJwtSubject.md) keeps the chain in the subject of an EVM session.

## Returns

[`SiwxSession`](/packages/siwx-server/server/interfaces/SiwxSession.md)

The session object to store or sign.

## Example

```ts
const result = await verifySiwxPayload(payload, { policy });
if (result.success && result.data) {
  const session = toSession(result.data, result.method);
}
```
