# SatelliteSiwxFieldOptions

Defined in: [siwx-react/src/satelliteHelpers.ts:32](https://github.com/TuwaIO/siwx/blob/main/packages/siwx-react/src/satelliteHelpers.ts#L32)

Options of [getSatelliteSiwxFields](/packages/siwx-react/functions/getSatelliteSiwxFields.md). The values are copied into the CAIP-122 fields.

## Properties

### domain?

> `optional` **domain?**: `string`

Defined in: [siwx-react/src/satelliteHelpers.ts:34](https://github.com/TuwaIO/siwx/blob/main/packages/siwx-react/src/satelliteHelpers.ts#L34)

Message `domain`. Defaults to `window.location.host` (empty string outside the browser).

***

### expirationSeconds?

> `optional` **expirationSeconds?**: `number`

Defined in: [siwx-react/src/satelliteHelpers.ts:45](https://github.com/TuwaIO/siwx/blob/main/packages/siwx-react/src/satelliteHelpers.ts#L45)

Lifetime of the message, in seconds from now, used when `expirationTime` is omitted.

#### Default

```ts
86400 (24 hours)
```

***

### expirationTime?

> `optional` **expirationTime?**: `string`

Defined in: [siwx-react/src/satelliteHelpers.ts:40](https://github.com/TuwaIO/siwx/blob/main/packages/siwx-react/src/satelliteHelpers.ts#L40)

Explicit ISO 8601 `expirationTime`. Takes precedence over `expirationSeconds`.

***

### notBefore?

> `optional` **notBefore?**: `string`

Defined in: [siwx-react/src/satelliteHelpers.ts:47](https://github.com/TuwaIO/siwx/blob/main/packages/siwx-react/src/satelliteHelpers.ts#L47)

ISO 8601 `notBefore`.

***

### requestId?

> `optional` **requestId?**: `string`

Defined in: [siwx-react/src/satelliteHelpers.ts:49](https://github.com/TuwaIO/siwx/blob/main/packages/siwx-react/src/satelliteHelpers.ts#L49)

Message `requestId`.

***

### resources?

> `optional` **resources?**: `string`[]

Defined in: [siwx-react/src/satelliteHelpers.ts:51](https://github.com/TuwaIO/siwx/blob/main/packages/siwx-react/src/satelliteHelpers.ts#L51)

Message `resources`.

***

### statement?

> `optional` **statement?**: `string`

Defined in: [siwx-react/src/satelliteHelpers.ts:38](https://github.com/TuwaIO/siwx/blob/main/packages/siwx-react/src/satelliteHelpers.ts#L38)

Human-readable statement shown in the wallet.

***

### uri?

> `optional` **uri?**: `string`

Defined in: [siwx-react/src/satelliteHelpers.ts:36](https://github.com/TuwaIO/siwx/blob/main/packages/siwx-react/src/satelliteHelpers.ts#L36)

Message `uri`. Defaults to `window.location.href` (empty string outside the browser).
