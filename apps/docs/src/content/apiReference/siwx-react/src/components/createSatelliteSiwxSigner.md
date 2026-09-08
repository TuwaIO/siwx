[**API Reference — @tuwaio/siwx (CAIP-122 Authentication Layer)**](../../../README.md)

***

# createSatelliteSiwxSigner()

> **createSatelliteSiwxSigner**(`activeConnection`): `Promise`\<(`message`) => `Promise`\<`string`\>\>

Defined in: [packages/siwx-react/src/satelliteHelpers.ts:82](https://github.com/TuwaIO/siwx/blob/f77d0e06aaa7919c3688c2277c2d9f28269ea2b6/packages/siwx-react/src/satelliteHelpers.ts#L82)

Accepts a Satellite connection and returns its native signing method.

## Parameters

### activeConnection

[`MinimalSatelliteConnection`](../interfaces/MinimalSatelliteConnection.md)

## Returns

`Promise`\<(`message`) => `Promise`\<`string`\>\>
