# StatelessDemoLimits

Defined in: [siwx-server/src/types.ts:176](https://github.com/TuwaIO/siwx/blob/main/packages/siwx-server/src/types.ts#L176)

Request limits of `createStatelessDemoSiwxHandler`. Only the body size is limited; rate limiting is not part of
SIWX.

## Properties

### maxTransactionPayloadBytes?

> `optional` **maxTransactionPayloadBytes?**: `number`

Defined in: [siwx-server/src/types.ts:182](https://github.com/TuwaIO/siwx/blob/main/packages/siwx-server/src/types.ts#L182)

Maximum body size of `POST /verify`. Larger requests are rejected with HTTP 413. The durable handler always
uses 65536.

#### Default

```ts
65536 (64 KB)
```
