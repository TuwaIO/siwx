[**API Reference — @tuwaio/siwx (CAIP-122 Authentication Layer)**](../../../README.md)

***

# getSatelliteSiwxFields()

> **getSatelliteSiwxFields**(`activeConnection`, `options?`): `object`

Defined in: [packages/siwx-react/src/satelliteHelpers.ts:30](https://github.com/TuwaIO/siwx/blob/fcaa3a6f9f1375901c6bae0f335f995349246d8e/packages/siwx-react/src/satelliteHelpers.ts#L30)

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
