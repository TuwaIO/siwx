# SiwxVerificationPolicy

Defined in: [siwx-core/src/types.ts:114](https://github.com/TuwaIO/siwx/blob/main/packages/siwx-core/src/types.ts#L114)

Rules that bind a CAIP-122 message to your application. Enforced by [validatePolicy](/packages/siwx-server/server/functions/validatePolicy.md), and by
[validateMessage](/packages/siwx-server/server/functions/validateMessage.md) when passed in its options.

Every rule below is optional and is skipped when its field is omitted. Two timing rules always apply, even without
a policy in [validateMessage](/packages/siwx-server/server/functions/validateMessage.md): messages whose `issuedAt` lies in the future beyond `clockSkewSeconds` are
rejected, and so are (unless `enforceNotBefore` is `false`) messages whose `notBefore` has not been reached.
Always set at least `expectedDomain` on the server.

## Properties

### allowedChainIds?

> `optional` **allowedChainIds?**: `string`[]

Defined in: [siwx-core/src/types.ts:134](https://github.com/TuwaIO/siwx/blob/main/packages/siwx-core/src/types.ts#L134)

Allowed CAIP-2 chain IDs. The message `chainId` must equal one of them exactly (bare references such as `"1"`
never match). An empty array allows every chain.

#### Example

```ts
["eip155:1", "solana:5eykt4UsFv8P8NJdTREpY1vzqKqZKvdpK"]
```

***

### clockSkewSeconds?

> `optional` **clockSkewSeconds?**: `number`

Defined in: [siwx-core/src/types.ts:159](https://github.com/TuwaIO/siwx/blob/main/packages/siwx-core/src/types.ts#L159)

Allowed clock difference between signer and verifier, in seconds. Applied to `issuedAt`, `notBefore` and
`expirationTime` checks.

#### Default

```ts
60
```

***

### enforceNotBefore?

> `optional` **enforceNotBefore?**: `boolean`

Defined in: [siwx-core/src/types.ts:165](https://github.com/TuwaIO/siwx/blob/main/packages/siwx-core/src/types.ts#L165)

Rejects messages whose `notBefore` is still in the future (beyond `clockSkewSeconds`).

#### Default

```ts
true
```

***

### expectedDomain?

> `optional` **expectedDomain?**: `string` \| `string`[]

Defined in: [siwx-core/src/types.ts:120](https://github.com/TuwaIO/siwx/blob/main/packages/siwx-core/src/types.ts#L120)

Accepted value(s) of the message `domain`, compared case-insensitively.

#### Examples

```ts
"tuwa.io"
```

```ts
["tuwa.io", "staging.tuwa.io"]
```

***

### expectedUri?

> `optional` **expectedUri?**: `string` \| `string`[]

Defined in: [siwx-core/src/types.ts:127](https://github.com/TuwaIO/siwx/blob/main/packages/siwx-core/src/types.ts#L127)

Accepted value(s) of the message `uri`. A message URI matches an expected URI when it is equal to it,
starts with it followed by `/`, or has the same origin (scheme, host and port).

#### Example

```ts
"https://tuwa.io"
```

***

### maxIssuedAtAgeSeconds?

> `optional` **maxIssuedAtAgeSeconds?**: `number`

Defined in: [siwx-core/src/types.ts:146](https://github.com/TuwaIO/siwx/blob/main/packages/siwx-core/src/types.ts#L146)

Maximum age of the message `issuedAt`, in seconds (plus `clockSkewSeconds`). Rejects stale messages.
There is no default: when omitted, the age is not checked.

***

### maxSessionLifetimeSeconds?

> `optional` **maxSessionLifetimeSeconds?**: `number`

Defined in: [siwx-core/src/types.ts:152](https://github.com/TuwaIO/siwx/blob/main/packages/siwx-core/src/types.ts#L152)

Maximum signed session lifetime (`expirationTime - issuedAt`), in seconds. Checked only when the message
has an `expirationTime`.

***

### requireExpirationTime?

> `optional` **requireExpirationTime?**: `boolean`

Defined in: [siwx-core/src/types.ts:140](https://github.com/TuwaIO/siwx/blob/main/packages/siwx-core/src/types.ts#L140)

Rejects messages without an `expirationTime`. Recommended for the stateless demo profile of
`@tuwaio/siwx-server`.
