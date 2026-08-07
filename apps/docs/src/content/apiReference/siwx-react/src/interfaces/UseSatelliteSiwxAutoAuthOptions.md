[**API Reference — @tuwaio/siwx (CAIP-122 Authentication Layer)**](../../../README.md)

***

# UseSatelliteSiwxAutoAuthOptions

Defined in: [packages/siwx-react/src/satelliteHelpers.ts:101](https://github.com/TuwaIO/siwx/blob/635cad282f213892454d5971831155271a225905/packages/siwx-react/src/satelliteHelpers.ts#L101)

Configuration options for the auto-auth hook.

## Extends

- [`SatelliteSiwxFieldOptions`](SatelliteSiwxFieldOptions.md)

## Properties

### activeConnection

> **activeConnection**: [`MinimalSatelliteConnection`](MinimalSatelliteConnection.md) \| `null` \| `undefined`

Defined in: [packages/siwx-react/src/satelliteHelpers.ts:102](https://github.com/TuwaIO/siwx/blob/635cad282f213892454d5971831155271a225905/packages/siwx-react/src/satelliteHelpers.ts#L102)

***

### domain?

> `optional` **domain?**: `string`

Defined in: [packages/siwx-react/src/satelliteHelpers.ts:30](https://github.com/TuwaIO/siwx/blob/635cad282f213892454d5971831155271a225905/packages/siwx-react/src/satelliteHelpers.ts#L30)

#### Inherited from

[`SatelliteSiwxFieldOptions`](SatelliteSiwxFieldOptions.md).[`domain`](SatelliteSiwxFieldOptions.md#domain)

***

### enabled?

> `optional` **enabled?**: `boolean`

Defined in: [packages/siwx-react/src/satelliteHelpers.ts:103](https://github.com/TuwaIO/siwx/blob/635cad282f213892454d5971831155271a225905/packages/siwx-react/src/satelliteHelpers.ts#L103)

***

### statement?

> `optional` **statement?**: `string`

Defined in: [packages/siwx-react/src/satelliteHelpers.ts:32](https://github.com/TuwaIO/siwx/blob/635cad282f213892454d5971831155271a225905/packages/siwx-react/src/satelliteHelpers.ts#L32)

#### Inherited from

[`SatelliteSiwxFieldOptions`](SatelliteSiwxFieldOptions.md).[`statement`](SatelliteSiwxFieldOptions.md#statement)

***

### uri?

> `optional` **uri?**: `string`

Defined in: [packages/siwx-react/src/satelliteHelpers.ts:31](https://github.com/TuwaIO/siwx/blob/635cad282f213892454d5971831155271a225905/packages/siwx-react/src/satelliteHelpers.ts#L31)

#### Inherited from

[`SatelliteSiwxFieldOptions`](SatelliteSiwxFieldOptions.md).[`uri`](SatelliteSiwxFieldOptions.md#uri)

***

### verifier

> **verifier**: (`payload`) => `Promise`\<[`SiwxClientSession`](SiwxClientSession.md) \| `null`\>

Defined in: [packages/siwx-react/src/satelliteHelpers.ts:104](https://github.com/TuwaIO/siwx/blob/635cad282f213892454d5971831155271a225905/packages/siwx-react/src/satelliteHelpers.ts#L104)

#### Parameters

##### payload

###### message

`string`

###### signature

`string`

#### Returns

`Promise`\<[`SiwxClientSession`](SiwxClientSession.md) \| `null`\>
