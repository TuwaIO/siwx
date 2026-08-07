[**API Reference — @tuwaio/siwx (CAIP-122 Authentication Layer)**](../../../README.md)

***

# getSatelliteSiwxFields()

> **getSatelliteSiwxFields**(`activeConnection`, `options?`): `object`

Defined in: [packages/siwx-react/src/satelliteHelpers.ts:28](https://github.com/TuwaIO/siwx/blob/21578d633a347019ae3f513dd601d57e4fa60138/packages/siwx-react/src/satelliteHelpers.ts#L28)

Generates exact CAIP-10 and CAIP-2 identifiers strictly from the active connection.

## Parameters

### activeConnection

[`MinimalSatelliteConnection`](../interfaces/MinimalSatelliteConnection.md)

### options?

[`SatelliteSiwxFieldOptions`](../interfaces/SatelliteSiwxFieldOptions.md)

## Returns

`object`

### address

> **address**: `string` = `caip10Address`

### chainId

> **chainId**: `never`

### domain

> **domain**: `string`

### statement

> **statement**: `string` \| `undefined` = `options.statement`

### uri

> **uri**: `string`
