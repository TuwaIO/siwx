[**API Reference — @tuwaio/siwx (CAIP-122 Authentication Layer)**](../../../README.md)

***

# createSatelliteSiwxSigner()

> **createSatelliteSiwxSigner**(`activeConnection`): `Promise`\<(`message`) => `Promise`\<`string`\>\>

Defined in: [packages/siwx-react/src/satelliteHelpers.ts:66](https://github.com/TuwaIO/siwx/blob/626c94cfe8fcb8d8d8caa69ff91c81d6883a0fec/packages/siwx-react/src/satelliteHelpers.ts#L66)

Accepts a Satellite connection and returns its native signing method.

## Parameters

### activeConnection

[`MinimalSatelliteConnection`](../interfaces/MinimalSatelliteConnection.md)

## Returns

`Promise`\<(`message`) => `Promise`\<`string`\>\>
