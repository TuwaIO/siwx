[**API Reference — @tuwaio/siwx (CAIP-122 Authentication Layer)**](../../../README.md)

***

# useSatelliteSiwxAutoAuth()

> **useSatelliteSiwxAutoAuth**(`options`): `void`

Defined in: [packages/siwx-react/src/satelliteHelpers.ts:111](https://github.com/TuwaIO/siwx/blob/ee070bdd2ff65c730e0fee4e3a75b864166091f0/packages/siwx-react/src/satelliteHelpers.ts#L111)

React hook that monitors a Satellite connection and automatically triggers a SIWX sign-in prompt.
Implements a `lastPromptedAddress` lock to prevent infinite prompt loops if the user rejects the signature.

## Parameters

### options

[`UseSatelliteSiwxAutoAuthOptions`](../interfaces/UseSatelliteSiwxAutoAuthOptions.md)

## Returns

`void`
