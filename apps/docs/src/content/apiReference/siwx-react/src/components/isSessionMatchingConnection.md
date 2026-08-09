[**API Reference — @tuwaio/siwx (CAIP-122 Authentication Layer)**](../../../README.md)

***

# isSessionMatchingConnection()

> **isSessionMatchingConnection**(`session`, `activeConnection`): `boolean`

Defined in: [packages/siwx-react/src/satelliteHelpers.ts:79](https://github.com/TuwaIO/siwx/blob/226309e8a8af6d2fb968b23cea6b3dc7f2a3300b/packages/siwx-react/src/satelliteHelpers.ts#L79)

Evaluates whether an active SIWX session matches an active Satellite connection.

## Parameters

### session

[`SiwxClientSession`](../interfaces/SiwxClientSession.md) \| `null`

### activeConnection

[`MinimalSatelliteConnection`](../interfaces/MinimalSatelliteConnection.md) \| `null` \| `undefined`

## Returns

`boolean`
