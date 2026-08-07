[**API Reference — @tuwaio/siwx (CAIP-122 Authentication Layer)**](../../../README.md)

***

# createSatelliteSiwxSigner()

> **createSatelliteSiwxSigner**(`activeConnection`): `Promise`\<(`message`) => `Promise`\<`string`\>\>

Defined in: [packages/siwx-react/src/satelliteHelpers.ts:68](https://github.com/TuwaIO/siwx/blob/38c3a86a4f2ede00b00c21f5bf6ebea6fa7bbcee/packages/siwx-react/src/satelliteHelpers.ts#L68)

Inspects a Satellite connection and dynamically loads the appropriate EVM or Solana SIWX signer.

## Parameters

### activeConnection

[`MinimalSatelliteConnection`](../interfaces/MinimalSatelliteConnection.md)

## Returns

`Promise`\<(`message`) => `Promise`\<`string`\>\>
