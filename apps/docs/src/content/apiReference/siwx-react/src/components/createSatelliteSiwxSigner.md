[**API Reference — @tuwaio/siwx (CAIP-122 Authentication Layer)**](../../../README.md)

***

# createSatelliteSiwxSigner()

> **createSatelliteSiwxSigner**(`activeConnection`): `Promise`\<(`message`) => `Promise`\<`string`\>\>

Defined in: [packages/siwx-react/src/satelliteHelpers.ts:68](https://github.com/TuwaIO/siwx/blob/635cad282f213892454d5971831155271a225905/packages/siwx-react/src/satelliteHelpers.ts#L68)

Inspects a Satellite connection and dynamically loads the appropriate EVM or Solana SIWX signer.

## Parameters

### activeConnection

[`MinimalSatelliteConnection`](../interfaces/MinimalSatelliteConnection.md)

## Returns

`Promise`\<(`message`) => `Promise`\<`string`\>\>
