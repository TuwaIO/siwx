[**API Reference — @tuwaio/siwx (CAIP-122 Authentication Layer)**](../../../README.md)

***

# getSatelliteSiwxFields()

> **getSatelliteSiwxFields**(`activeConnection`, `options?`): `object`

Defined in: [packages/siwx-react/src/satelliteHelpers.ts:35](https://github.com/TuwaIO/siwx/blob/21b3a05b39d40806567e8859c0d7699b6b50336c/packages/siwx-react/src/satelliteHelpers.ts#L35)

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

### expirationTime

> **expirationTime**: `string`

### notBefore

> **notBefore**: `string` \| `undefined` = `options.notBefore`

### requestId

> **requestId**: `string` \| `undefined` = `options.requestId`

### resources

> **resources**: `string`[] \| `undefined` = `options.resources`

### statement

> **statement**: `string` \| `undefined` = `options.statement`

### uri

> **uri**: `string`
