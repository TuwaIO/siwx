[**API Reference — @tuwaio/siwx (CAIP-122 Authentication Layer)**](../../../README.md)

***

# StatelessDemoLimits

Defined in: [packages/siwx-server/src/types.ts:157](https://github.com/TuwaIO/siwx/blob/5afdbf8444bc2b94d7f938774996543e40e8ee51/packages/siwx-server/src/types.ts#L157)

Enforceable request boundary limits for the stateless demo profile.

Note: Shared rate limits and request quotas across multiple replicas require
a durable store or are authoritative at the Quasar App RPS / Quota layer.

## Properties

### maxTransactionPayloadBytes?

> `optional` **maxTransactionPayloadBytes?**: `number`

Defined in: [packages/siwx-server/src/types.ts:163](https://github.com/TuwaIO/siwx/blob/5afdbf8444bc2b94d7f938774996543e40e8ee51/packages/siwx-server/src/types.ts#L163)

Maximum allowed incoming payload body size in bytes for SIWX verification endpoints.
Requests exceeding this limit will be rejected with HTTP 413 (Payload Too Large).

#### Default

```ts
65536 (64 KB)
```
