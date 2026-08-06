[**API Reference — @tuwaio/siwx (CAIP-122 Authentication Layer)**](../../../README.md)

***

# createSatelliteSiwxSigner()

> **createSatelliteSiwxSigner**(`activeConnection`): `Promise`\<(`message`) => `Promise`\<`string`\>\>

Defined in: [packages/siwx-react/src/satelliteHelpers.ts:68](https://github.com/TuwaIO/siwx/blob/b9b124994d5ac633a6d509fd0c9a5e5efdaac504/packages/siwx-react/src/satelliteHelpers.ts#L68)

Inspects a Satellite connection and dynamically loads the appropriate EVM or Solana SIWX signer.

## Parameters

### activeConnection

[`MinimalSatelliteConnection`](../interfaces/MinimalSatelliteConnection.md)

## Returns

`Promise`\<(`message`) => `Promise`\<`string`\>\>
