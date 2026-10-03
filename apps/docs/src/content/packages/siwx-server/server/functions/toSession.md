# toSession()

> **toSession**(`parsed`): [`SiwxSession`](/packages/siwx-server/server/interfaces/SiwxSession.md)

Defined in: [siwx-server/src/types.ts:277](https://github.com/TuwaIO/siwx/blob/main/packages/siwx-server/src/types.ts#L277)

Converts a verified CAIP-122 message into a [SiwxSession](/packages/siwx-server/server/interfaces/SiwxSession.md): keeps `address`, `chainId`, `domain`, `nonce`,
`issuedAt` and `expirationTime`. Pure function.

## Parameters

### parsed

[`SiwxMessageFields`](/packages/siwx-server/server/interfaces/SiwxMessageFields.md)

The verified message, for example `result.data` of [verifySiwxPayload](/packages/siwx-server/server/functions/verifySiwxPayload.md).

## Returns

[`SiwxSession`](/packages/siwx-server/server/interfaces/SiwxSession.md)

The session object to store or sign.
