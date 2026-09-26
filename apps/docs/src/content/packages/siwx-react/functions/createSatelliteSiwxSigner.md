# createSatelliteSiwxSigner()

> **createSatelliteSiwxSigner**(`activeConnection`): `Promise`\<(`message`) => `Promise`\<`string`\>\>

Defined in: [siwx-react/src/satelliteHelpers.ts:123](https://github.com/TuwaIO/siwx/blob/main/packages/siwx-react/src/satelliteHelpers.ts#L123)

Returns the `signMessage` method of an active Satellite Connect connection, to be used as `signer` in
`useSiwx().signIn`.

## Parameters

### activeConnection

[`MinimalSatelliteConnection`](/packages/siwx-react/interfaces/MinimalSatelliteConnection.md)

The active connection.

## Returns

`Promise`\<(`message`) => `Promise`\<`string`\>\>

A promise resolving to `activeConnection.signMessage`.

## Throws

`[SIWX-REACT] Connection missing signMessage capability.` (as a rejected promise) when the
connection has no `signMessage`.
