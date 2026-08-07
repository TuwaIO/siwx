[**API Reference — @tuwaio/siwx (CAIP-122 Authentication Layer)**](../../../README.md)

***

# createSatelliteSiwxSigner()

> **createSatelliteSiwxSigner**(`activeConnection`): `Promise`\<(`message`) => `Promise`\<`string`\>\>

Defined in: [packages/siwx-react/src/satelliteHelpers.ts:68](https://github.com/TuwaIO/siwx/blob/ee070bdd2ff65c730e0fee4e3a75b864166091f0/packages/siwx-react/src/satelliteHelpers.ts#L68)

Inspects a Satellite connection and dynamically loads the appropriate EVM or Solana SIWX signer.

## Parameters

### activeConnection

[`MinimalSatelliteConnection`](../interfaces/MinimalSatelliteConnection.md)

## Returns

`Promise`\<(`message`) => `Promise`\<`string`\>\>
