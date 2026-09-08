[**API Reference — @tuwaio/siwx (CAIP-122 Authentication Layer)**](../../../README.md)

***

# isSessionMatchingConnection()

> **isSessionMatchingConnection**(`session`, `activeConnection`): `boolean`

Defined in: [packages/siwx-react/src/satelliteHelpers.ts:95](https://github.com/TuwaIO/siwx/blob/f77d0e06aaa7919c3688c2277c2d9f28269ea2b6/packages/siwx-react/src/satelliteHelpers.ts#L95)

Evaluates whether an active SIWX session matches an active Satellite connection.

## Parameters

### session

[`SiwxClientSession`](../interfaces/SiwxClientSession.md) \| `null`

### activeConnection

[`MinimalSatelliteConnection`](../interfaces/MinimalSatelliteConnection.md) \| `null` \| `undefined`

## Returns

`boolean`
