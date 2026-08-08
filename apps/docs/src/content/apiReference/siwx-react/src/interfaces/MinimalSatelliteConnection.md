[**API Reference — @tuwaio/siwx (CAIP-122 Authentication Layer)**](../../../README.md)

***

# MinimalSatelliteConnection

Defined in: [packages/siwx-react/src/satelliteHelpers.ts:6](https://github.com/TuwaIO/siwx/blob/626c94cfe8fcb8d8d8caa69ff91c81d6883a0fec/packages/siwx-react/src/satelliteHelpers.ts#L6)

Duck-typed interface for a Satellite Connection to avoid strict dependency on `@tuwaio/satellite-core`.

## Properties

### address?

> `optional` **address?**: `string`

Defined in: [packages/siwx-react/src/satelliteHelpers.ts:8](https://github.com/TuwaIO/siwx/blob/626c94cfe8fcb8d8d8caa69ff91c81d6883a0fec/packages/siwx-react/src/satelliteHelpers.ts#L8)

***

### chainId?

> `optional` **chainId?**: `string` \| `number`

Defined in: [packages/siwx-react/src/satelliteHelpers.ts:9](https://github.com/TuwaIO/siwx/blob/626c94cfe8fcb8d8d8caa69ff91c81d6883a0fec/packages/siwx-react/src/satelliteHelpers.ts#L9)

***

### connectedAccount?

> `optional` **connectedAccount?**: `unknown`

Defined in: [packages/siwx-react/src/satelliteHelpers.ts:14](https://github.com/TuwaIO/siwx/blob/626c94cfe8fcb8d8d8caa69ff91c81d6883a0fec/packages/siwx-react/src/satelliteHelpers.ts#L14)

***

### connectedWallet?

> `optional` **connectedWallet?**: `unknown`

Defined in: [packages/siwx-react/src/satelliteHelpers.ts:15](https://github.com/TuwaIO/siwx/blob/626c94cfe8fcb8d8d8caa69ff91c81d6883a0fec/packages/siwx-react/src/satelliteHelpers.ts#L15)

***

### connector?

> `optional` **connector?**: `object`

Defined in: [packages/siwx-react/src/satelliteHelpers.ts:11](https://github.com/TuwaIO/siwx/blob/626c94cfe8fcb8d8d8caa69ff91c81d6883a0fec/packages/siwx-react/src/satelliteHelpers.ts#L11)

#### getWalletClient?

> `optional` **getWalletClient?**: () => `Promise`\<`unknown`\>

##### Returns

`Promise`\<`unknown`\>

***

### isConnected?

> `optional` **isConnected?**: `boolean`

Defined in: [packages/siwx-react/src/satelliteHelpers.ts:7](https://github.com/TuwaIO/siwx/blob/626c94cfe8fcb8d8d8caa69ff91c81d6883a0fec/packages/siwx-react/src/satelliteHelpers.ts#L7)

***

### signMessage?

> `optional` **signMessage?**: (`message`) => `Promise`\<`string`\>

Defined in: [packages/siwx-react/src/satelliteHelpers.ts:10](https://github.com/TuwaIO/siwx/blob/626c94cfe8fcb8d8d8caa69ff91c81d6883a0fec/packages/siwx-react/src/satelliteHelpers.ts#L10)

#### Parameters

##### message

`string`

#### Returns

`Promise`\<`string`\>
