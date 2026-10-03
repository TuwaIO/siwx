# isSessionMatchingConnection()

> **isSessionMatchingConnection**(`session`, `activeConnection`): `boolean`

Defined in: [siwx-react/src/satelliteHelpers.ts:149](https://github.com/TuwaIO/siwx/blob/main/packages/siwx-react/src/satelliteHelpers.ts#L149)

Checks whether a SIWX session was issued for the active Satellite Connect connection, for example to reset the
session after the user switches account or chain.

The session `chainId` must equal the connection's CAIP-2 chain ID, and the session `address` must equal its
CAIP-10 account ID (compared case-insensitively for `eip155` sessions). A Solana session signed with a cluster name
(`solana:devnet`) matches a connection to that cluster, whose chain ID is now the genesis-hash one.

## Parameters

### session

[`SiwxClientSession`](/packages/siwx-react/interfaces/SiwxClientSession.md) \| `null`

The current session, for example `useSiwxSession().session`.

### activeConnection

[`MinimalSatelliteConnection`](/packages/siwx-react/interfaces/MinimalSatelliteConnection.md) \| `null` \| `undefined`

The active connection.

## Returns

`boolean`

`true` when both match; `false` otherwise, including when either argument or the connection address or
chain is missing. Never throws.
