# SatelliteSiwxFieldOptions

Defined in: [siwx-react/src/satelliteHelpers.ts:39](https://github.com/TuwaIO/siwx/blob/main/packages/siwx-react/src/satelliteHelpers.ts#L39)

Options of [getSatelliteSiwxFields](/packages/siwx-react/functions/getSatelliteSiwxFields.md). The values are copied into the CAIP-122 fields.

## Properties

### domain?

> `optional` **domain?**: `string`

Defined in: [siwx-react/src/satelliteHelpers.ts:41](https://github.com/TuwaIO/siwx/blob/main/packages/siwx-react/src/satelliteHelpers.ts#L41)

Message `domain`. Defaults to `window.location.host` (empty string outside the browser).

***

### expirationSeconds?

> `optional` **expirationSeconds?**: `number`

Defined in: [siwx-react/src/satelliteHelpers.ts:52](https://github.com/TuwaIO/siwx/blob/main/packages/siwx-react/src/satelliteHelpers.ts#L52)

Lifetime of the message, in seconds from now, used when `expirationTime` is omitted.

#### Default

```ts
86400 (24 hours)
```

***

### expirationTime?

> `optional` **expirationTime?**: `string`

Defined in: [siwx-react/src/satelliteHelpers.ts:47](https://github.com/TuwaIO/siwx/blob/main/packages/siwx-react/src/satelliteHelpers.ts#L47)

Explicit ISO 8601 `expirationTime`. Takes precedence over `expirationSeconds`.

***

### notBefore?

> `optional` **notBefore?**: `string`

Defined in: [siwx-react/src/satelliteHelpers.ts:54](https://github.com/TuwaIO/siwx/blob/main/packages/siwx-react/src/satelliteHelpers.ts#L54)

ISO 8601 `notBefore`.

***

### requestId?

> `optional` **requestId?**: `string`

Defined in: [siwx-react/src/satelliteHelpers.ts:56](https://github.com/TuwaIO/siwx/blob/main/packages/siwx-react/src/satelliteHelpers.ts#L56)

Message `requestId`.

***

### resources?

> `optional` **resources?**: `string`[]

Defined in: [siwx-react/src/satelliteHelpers.ts:58](https://github.com/TuwaIO/siwx/blob/main/packages/siwx-react/src/satelliteHelpers.ts#L58)

Message `resources`.

***

### statement?

> `optional` **statement?**: `string`

Defined in: [siwx-react/src/satelliteHelpers.ts:45](https://github.com/TuwaIO/siwx/blob/main/packages/siwx-react/src/satelliteHelpers.ts#L45)

Human-readable statement shown in the wallet.

***

### uri?

> `optional` **uri?**: `string`

Defined in: [siwx-react/src/satelliteHelpers.ts:43](https://github.com/TuwaIO/siwx/blob/main/packages/siwx-react/src/satelliteHelpers.ts#L43)

Message `uri`. Defaults to `window.location.href` (empty string outside the browser).
