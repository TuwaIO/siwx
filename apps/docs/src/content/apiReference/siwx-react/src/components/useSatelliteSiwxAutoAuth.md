[**API Reference — @tuwaio/siwx (CAIP-122 Authentication Layer)**](../../../README.md)

***

# useSatelliteSiwxAutoAuth()

> **useSatelliteSiwxAutoAuth**(`options`): `void`

Defined in: [packages/siwx-react/src/satelliteHelpers.ts:111](https://github.com/TuwaIO/siwx/blob/38c3a86a4f2ede00b00c21f5bf6ebea6fa7bbcee/packages/siwx-react/src/satelliteHelpers.ts#L111)

React hook that monitors a Satellite connection and automatically triggers a SIWX sign-in prompt.
Implements a `lastPromptedAddress` lock to prevent infinite prompt loops if the user rejects the signature.

## Parameters

### options

[`UseSatelliteSiwxAutoAuthOptions`](../interfaces/UseSatelliteSiwxAutoAuthOptions.md)

## Returns

`void`
