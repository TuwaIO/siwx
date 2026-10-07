# MinimalSatelliteConnection

Defined in: [siwx-react/src/satelliteHelpers.ts:10](https://github.com/TuwaIO/siwx/blob/main/packages/siwx-react/src/satelliteHelpers.ts#L10)

Duck-typed subset of an active Satellite Connect connection, so `@tuwaio/siwx-react` does not depend on
`@tuwaio/satellite-core`. Only `address`, `chainId`, `signMessage` and `connector` are read by the helpers.

## Properties

### address?

> `optional` **address?**: `string`

Defined in: [siwx-react/src/satelliteHelpers.ts:14](https://github.com/TuwaIO/siwx/blob/main/packages/siwx-react/src/satelliteHelpers.ts#L14)

Connected account, as a plain address or a CAIP-10 account ID.

***

### chainId?

> `optional` **chainId?**: `string` \| `number`

Defined in: [siwx-react/src/satelliteHelpers.ts:16](https://github.com/TuwaIO/siwx/blob/main/packages/siwx-react/src/satelliteHelpers.ts#L16)

Connected chain: an EVM chain ID number, a chain reference or a CAIP-2 ID.

***

### connectedAccount?

> `optional` **connectedAccount?**: `unknown`

Defined in: [siwx-react/src/satelliteHelpers.ts:25](https://github.com/TuwaIO/siwx/blob/main/packages/siwx-react/src/satelliteHelpers.ts#L25)

Connected account object of the wallet library. Not read by the helpers.

***

### connectedWallet?

> `optional` **connectedWallet?**: `unknown`

Defined in: [siwx-react/src/satelliteHelpers.ts:27](https://github.com/TuwaIO/siwx/blob/main/packages/siwx-react/src/satelliteHelpers.ts#L27)

Connected wallet object of the wallet library. Not read by the helpers.

***

### connector?

> `optional` **connector?**: `object`

Defined in: [siwx-react/src/satelliteHelpers.ts:23](https://github.com/TuwaIO/siwx/blob/main/packages/siwx-react/src/satelliteHelpers.ts#L23)

EVM connector, for example the wagmi `Connector` of an `EVMConnection` from `@tuwaio/satellite-evm`. Only its
presence is read: it marks the connection as EVM in [getSatelliteSiwxFields](/packages/siwx-react/functions/getSatelliteSiwxFields.md).

***

### isConnected?

> `optional` **isConnected?**: `boolean`

Defined in: [siwx-react/src/satelliteHelpers.ts:12](https://github.com/TuwaIO/siwx/blob/main/packages/siwx-react/src/satelliteHelpers.ts#L12)

Whether the wallet is connected. Not read by the helpers.

***

### signMessage?

> `optional` **signMessage?**: (`message`) => `Promise`\<`string`\>

Defined in: [siwx-react/src/satelliteHelpers.ts:18](https://github.com/TuwaIO/siwx/blob/main/packages/siwx-react/src/satelliteHelpers.ts#L18)

Signs a message with the connected wallet. Returned by [createSatelliteSiwxSigner](/packages/siwx-react/functions/createSatelliteSiwxSigner.md).

#### Parameters

##### message

`string`

#### Returns

`Promise`\<`string`\>
