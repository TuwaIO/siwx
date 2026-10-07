# StatelessDemoLimits

Defined in: [siwx-server/src/types.ts:178](https://github.com/TuwaIO/siwx/blob/main/packages/siwx-server/src/types.ts#L178)

Request limits of `createStatelessDemoSiwxHandler`. Only the body size is limited; rate limiting is not part of
SIWX.

## Properties

### maxTransactionPayloadBytes?

> `optional` **maxTransactionPayloadBytes?**: `number`

Defined in: [siwx-server/src/types.ts:184](https://github.com/TuwaIO/siwx/blob/main/packages/siwx-server/src/types.ts#L184)

Maximum body size of `POST /verify`. Larger requests are rejected with HTTP 413. The durable handler always
uses 65536.

#### Default

```ts
65536 (64 KB)
```
