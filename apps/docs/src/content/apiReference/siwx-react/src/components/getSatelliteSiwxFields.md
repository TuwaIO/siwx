[**API Reference — @tuwaio/siwx (CAIP-122 Authentication Layer)**](../../../README.md)

***

# getSatelliteSiwxFields()

> **getSatelliteSiwxFields**(`activeConnection`, `options?`): `object`

Defined in: [packages/siwx-react/src/satelliteHelpers.ts:38](https://github.com/TuwaIO/siwx/blob/b9b124994d5ac633a6d509fd0c9a5e5efdaac504/packages/siwx-react/src/satelliteHelpers.ts#L38)

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
