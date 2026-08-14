[**API Reference — @tuwaio/siwx (CAIP-122 Authentication Layer)**](../../../README.md)

***

# isSessionMatchingConnection()

> **isSessionMatchingConnection**(`session`, `activeConnection`): `boolean`

Defined in: [packages/siwx-react/src/satelliteHelpers.ts:95](https://github.com/TuwaIO/siwx/blob/21b3a05b39d40806567e8859c0d7699b6b50336c/packages/siwx-react/src/satelliteHelpers.ts#L95)

Evaluates whether an active SIWX session matches an active Satellite connection.

## Parameters

### session

[`SiwxClientSession`](../interfaces/SiwxClientSession.md) \| `null`

### activeConnection

[`MinimalSatelliteConnection`](../interfaces/MinimalSatelliteConnection.md) \| `null` \| `undefined`

## Returns

`boolean`
