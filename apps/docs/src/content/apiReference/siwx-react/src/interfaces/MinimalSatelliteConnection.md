[**API Reference — @tuwaio/siwx (CAIP-122 Authentication Layer)**](../../../README.md)

***

# MinimalSatelliteConnection

Defined in: [packages/siwx-react/src/satelliteHelpers.ts:15](https://github.com/TuwaIO/siwx/blob/8e4b42d7efd91d50100ad87a03ed6922bb680d68/packages/siwx-react/src/satelliteHelpers.ts#L15)

Duck-typed interface for a Satellite Connection to avoid strict dependency on `@tuwaio/satellite-core`.

## Properties

### address?

> `optional` **address?**: `string`

Defined in: [packages/siwx-react/src/satelliteHelpers.ts:17](https://github.com/TuwaIO/siwx/blob/8e4b42d7efd91d50100ad87a03ed6922bb680d68/packages/siwx-react/src/satelliteHelpers.ts#L17)

***

### chainId?

> `optional` **chainId?**: `string` \| `number`

Defined in: [packages/siwx-react/src/satelliteHelpers.ts:18](https://github.com/TuwaIO/siwx/blob/8e4b42d7efd91d50100ad87a03ed6922bb680d68/packages/siwx-react/src/satelliteHelpers.ts#L18)

***

### connectedAccount?

> `optional` **connectedAccount?**: `unknown`

Defined in: [packages/siwx-react/src/satelliteHelpers.ts:22](https://github.com/TuwaIO/siwx/blob/8e4b42d7efd91d50100ad87a03ed6922bb680d68/packages/siwx-react/src/satelliteHelpers.ts#L22)

***

### connectedWallet?

> `optional` **connectedWallet?**: `unknown`

Defined in: [packages/siwx-react/src/satelliteHelpers.ts:23](https://github.com/TuwaIO/siwx/blob/8e4b42d7efd91d50100ad87a03ed6922bb680d68/packages/siwx-react/src/satelliteHelpers.ts#L23)

***

### connector?

> `optional` **connector?**: `object`

Defined in: [packages/siwx-react/src/satelliteHelpers.ts:19](https://github.com/TuwaIO/siwx/blob/8e4b42d7efd91d50100ad87a03ed6922bb680d68/packages/siwx-react/src/satelliteHelpers.ts#L19)

#### getWalletClient?

> `optional` **getWalletClient?**: () => `Promise`\<`unknown`\>

##### Returns

`Promise`\<`unknown`\>

***

### isConnected?

> `optional` **isConnected?**: `boolean`

Defined in: [packages/siwx-react/src/satelliteHelpers.ts:16](https://github.com/TuwaIO/siwx/blob/8e4b42d7efd91d50100ad87a03ed6922bb680d68/packages/siwx-react/src/satelliteHelpers.ts#L16)
