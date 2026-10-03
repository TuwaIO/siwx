# getSatelliteSiwxFields()

> **getSatelliteSiwxFields**(`activeConnection`, `options?`): `Omit`\<[`SiwxMessageFields`](/packages/siwx-react/interfaces/SiwxMessageFields.md), `"nonce"` \| `"issuedAt"` \| `"version"`\>

Defined in: [siwx-react/src/satelliteHelpers.ts:72](https://github.com/TuwaIO/siwx/blob/main/packages/siwx-react/src/satelliteHelpers.ts#L72)

Builds the CAIP-122 `fields` for `useSiwx().signIn` from an active Satellite Connect connection.

The connection is treated as EVM when its address starts with `0x` or `eip155:`, its `chainId` is a number or
starts with `eip155:`, or it has a `connector`; otherwise it is treated as Solana. The CAIP-2 `chainId` is
`{namespace}:{reference}` and the CAIP-10 `address` is `{chainId}:{account}`. A Solana cluster, given as a moniker
(`devnet`, as in a Satellite Connect connection) or a Wallet Standard chain (`solana:devnet`), gets its genesis-hash
chain ID (`solana:EtWTRABZaYq6iMfeYKouRu166VU2xqa1`) through `normalizeSolanaChainId` from `@tuwaio/siwx-core`.

Reads `window.location` for the default `domain` and `uri`. `nonce`, `issuedAt` and `version` are not included;
`useSiwx` fills them in.

## Parameters

### activeConnection

[`MinimalSatelliteConnection`](/packages/siwx-react/interfaces/MinimalSatelliteConnection.md)

The active connection. Must have `address` and `chainId`.

### options?

[`SatelliteSiwxFieldOptions`](/packages/siwx-react/interfaces/SatelliteSiwxFieldOptions.md)

Values for the other message fields.

## Returns

`Omit`\<[`SiwxMessageFields`](/packages/siwx-react/interfaces/SiwxMessageFields.md), `"nonce"` \| `"issuedAt"` \| `"version"`\>

The message fields: `domain`, `uri`, `statement`, `expirationTime`, `notBefore`, `requestId`,
`resources`, `address` and `chainId`.

## Throws

`[SIWX-REACT] Connection missing address or chainId.` when either value is missing.
