[**API Reference — @tuwaio/siwx (CAIP-122 Authentication Layer)**](../../../README.md)

***

# isSessionMatchingConnection()

> **isSessionMatchingConnection**(`session`, `activeConnection`): `boolean`

Defined in: [packages/siwx-react/src/satelliteHelpers.ts:95](https://github.com/TuwaIO/siwx/blob/0ca0708dd74b07eb7d1d46e0b3ebb6c65b68bbc8/packages/siwx-react/src/satelliteHelpers.ts#L95)

Evaluates whether an active SIWX session matches an active Satellite connection.

## Parameters

### session

[`SiwxClientSession`](../interfaces/SiwxClientSession.md) \| `null`

### activeConnection

[`MinimalSatelliteConnection`](../interfaces/MinimalSatelliteConnection.md) \| `null` \| `undefined`

## Returns

`boolean`
