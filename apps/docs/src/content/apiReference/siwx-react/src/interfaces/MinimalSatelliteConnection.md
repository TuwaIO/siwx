[**API Reference — @tuwaio/siwx (CAIP-122 Authentication Layer)**](../../../README.md)

***

# MinimalSatelliteConnection

Defined in: [packages/siwx-react/src/satelliteHelpers.ts:4](https://github.com/TuwaIO/siwx/blob/5bd36b810264d62d40a05e48557149b572817954/packages/siwx-react/src/satelliteHelpers.ts#L4)

Duck-typed interface for a Satellite Connection to avoid strict dependency on `@tuwaio/satellite-core`.

## Properties

### address?

> `optional` **address?**: `string`

Defined in: [packages/siwx-react/src/satelliteHelpers.ts:6](https://github.com/TuwaIO/siwx/blob/5bd36b810264d62d40a05e48557149b572817954/packages/siwx-react/src/satelliteHelpers.ts#L6)

***

### chainId?

> `optional` **chainId?**: `string` \| `number`

Defined in: [packages/siwx-react/src/satelliteHelpers.ts:7](https://github.com/TuwaIO/siwx/blob/5bd36b810264d62d40a05e48557149b572817954/packages/siwx-react/src/satelliteHelpers.ts#L7)

***

### connectedAccount?

> `optional` **connectedAccount?**: `unknown`

Defined in: [packages/siwx-react/src/satelliteHelpers.ts:12](https://github.com/TuwaIO/siwx/blob/5bd36b810264d62d40a05e48557149b572817954/packages/siwx-react/src/satelliteHelpers.ts#L12)

***

### connectedWallet?

> `optional` **connectedWallet?**: `unknown`

Defined in: [packages/siwx-react/src/satelliteHelpers.ts:13](https://github.com/TuwaIO/siwx/blob/5bd36b810264d62d40a05e48557149b572817954/packages/siwx-react/src/satelliteHelpers.ts#L13)

***

### connector?

> `optional` **connector?**: `object`

Defined in: [packages/siwx-react/src/satelliteHelpers.ts:9](https://github.com/TuwaIO/siwx/blob/5bd36b810264d62d40a05e48557149b572817954/packages/siwx-react/src/satelliteHelpers.ts#L9)

#### getWalletClient?

> `optional` **getWalletClient?**: () => `Promise`\<`unknown`\>

##### Returns

`Promise`\<`unknown`\>

***

### isConnected?

> `optional` **isConnected?**: `boolean`

Defined in: [packages/siwx-react/src/satelliteHelpers.ts:5](https://github.com/TuwaIO/siwx/blob/5bd36b810264d62d40a05e48557149b572817954/packages/siwx-react/src/satelliteHelpers.ts#L5)

***

### signMessage?

> `optional` **signMessage?**: (`message`) => `Promise`\<`string`\>

Defined in: [packages/siwx-react/src/satelliteHelpers.ts:8](https://github.com/TuwaIO/siwx/blob/5bd36b810264d62d40a05e48557149b572817954/packages/siwx-react/src/satelliteHelpers.ts#L8)

#### Parameters

##### message

`string`

#### Returns

`Promise`\<`string`\>
