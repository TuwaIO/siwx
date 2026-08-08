[**API Reference — @tuwaio/siwx (CAIP-122 Authentication Layer)**](../../../README.md)

***

# isSessionMatchingConnection()

> **isSessionMatchingConnection**(`session`, `activeConnection`): `boolean`

Defined in: [packages/siwx-react/src/satelliteHelpers.ts:79](https://github.com/TuwaIO/siwx/blob/626c94cfe8fcb8d8d8caa69ff91c81d6883a0fec/packages/siwx-react/src/satelliteHelpers.ts#L79)

Evaluates whether an active SIWX session matches an active Satellite connection.

## Parameters

### session

[`SiwxClientSession`](../interfaces/SiwxClientSession.md) \| `null`

### activeConnection

[`MinimalSatelliteConnection`](../interfaces/MinimalSatelliteConnection.md) \| `null` \| `undefined`

## Returns

`boolean`
