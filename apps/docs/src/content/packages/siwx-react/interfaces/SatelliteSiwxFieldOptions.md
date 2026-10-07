# SatelliteSiwxFieldOptions

Defined in: [siwx-react/src/satelliteHelpers.ts:33](https://github.com/TuwaIO/siwx/blob/main/packages/siwx-react/src/satelliteHelpers.ts#L33)

Options of [getSatelliteSiwxFields](/packages/siwx-react/functions/getSatelliteSiwxFields.md). The values are copied into the CAIP-122 fields.

## Properties

### domain?

> `optional` **domain?**: `string`

Defined in: [siwx-react/src/satelliteHelpers.ts:35](https://github.com/TuwaIO/siwx/blob/main/packages/siwx-react/src/satelliteHelpers.ts#L35)

Message `domain`. Defaults to `window.location.host` (empty string outside the browser).

***

### expirationSeconds?

> `optional` **expirationSeconds?**: `number`

Defined in: [siwx-react/src/satelliteHelpers.ts:46](https://github.com/TuwaIO/siwx/blob/main/packages/siwx-react/src/satelliteHelpers.ts#L46)

Lifetime of the message, in seconds from now, used when `expirationTime` is omitted.

#### Default

```ts
86400 (24 hours)
```

***

### expirationTime?

> `optional` **expirationTime?**: `string`

Defined in: [siwx-react/src/satelliteHelpers.ts:41](https://github.com/TuwaIO/siwx/blob/main/packages/siwx-react/src/satelliteHelpers.ts#L41)

Explicit ISO 8601 `expirationTime`. Takes precedence over `expirationSeconds`.

***

### notBefore?

> `optional` **notBefore?**: `string`

Defined in: [siwx-react/src/satelliteHelpers.ts:48](https://github.com/TuwaIO/siwx/blob/main/packages/siwx-react/src/satelliteHelpers.ts#L48)

ISO 8601 `notBefore`.

***

### requestId?

> `optional` **requestId?**: `string`

Defined in: [siwx-react/src/satelliteHelpers.ts:50](https://github.com/TuwaIO/siwx/blob/main/packages/siwx-react/src/satelliteHelpers.ts#L50)

Message `requestId`.

***

### resources?

> `optional` **resources?**: `string`[]

Defined in: [siwx-react/src/satelliteHelpers.ts:52](https://github.com/TuwaIO/siwx/blob/main/packages/siwx-react/src/satelliteHelpers.ts#L52)

Message `resources`.

***

### statement?

> `optional` **statement?**: `string`

Defined in: [siwx-react/src/satelliteHelpers.ts:39](https://github.com/TuwaIO/siwx/blob/main/packages/siwx-react/src/satelliteHelpers.ts#L39)

Human-readable statement shown in the wallet.

***

### uri?

> `optional` **uri?**: `string`

Defined in: [siwx-react/src/satelliteHelpers.ts:37](https://github.com/TuwaIO/siwx/blob/main/packages/siwx-react/src/satelliteHelpers.ts#L37)

Message `uri`. Defaults to `window.location.href` (empty string outside the browser).
