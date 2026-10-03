# SiwxVerificationPolicy

Defined in: [types.ts:114](https://github.com/TuwaIO/siwx/blob/main/packages/siwx-core/src/types.ts#L114)

Rules that bind a CAIP-122 message to your application. Enforced by [validatePolicy](/packages/siwx-core/functions/validatePolicy.md), and by
[validateMessage](/packages/siwx-core/functions/validateMessage.md) when passed in its options.

Every rule below is optional and is skipped when its field is omitted. Two timing rules always apply, even without
a policy in [validateMessage](/packages/siwx-core/functions/validateMessage.md): messages whose `issuedAt` lies in the future beyond `clockSkewSeconds` are
rejected, and so are (unless `enforceNotBefore` is `false`) messages whose `notBefore` has not been reached.
Always set at least `expectedDomain` on the server.

## Properties

### allowedChainIds?

> `optional` **allowedChainIds?**: `string`[]

Defined in: [types.ts:135](https://github.com/TuwaIO/siwx/blob/main/packages/siwx-core/src/types.ts#L135)

Allowed CAIP-2 chain IDs. The message `chainId` must equal one of them exactly (bare references such as `"1"`
never match), except that a Solana cluster matches under its name and its genesis-hash chain ID (`solana:devnet`
allows `solana:EtWTRABZaYq6iMfeYKouRu166VU2xqa1`, see `isChainIdAllowed`). An empty array allows every chain.

#### Example

```ts
["eip155:1", "solana:5eykt4UsFv8P8NJdTREpY1vzqKqZKvdp"]
```

***

### clockSkewSeconds?

> `optional` **clockSkewSeconds?**: `number`

Defined in: [types.ts:160](https://github.com/TuwaIO/siwx/blob/main/packages/siwx-core/src/types.ts#L160)

Allowed clock difference between signer and verifier, in seconds. Applied to `issuedAt`, `notBefore` and
`expirationTime` checks.

#### Default

```ts
60
```

***

### enforceNotBefore?

> `optional` **enforceNotBefore?**: `boolean`

Defined in: [types.ts:166](https://github.com/TuwaIO/siwx/blob/main/packages/siwx-core/src/types.ts#L166)

Rejects messages whose `notBefore` is still in the future (beyond `clockSkewSeconds`).

#### Default

```ts
true
```

***

### expectedDomain?

> `optional` **expectedDomain?**: `string` \| `string`[]

Defined in: [types.ts:120](https://github.com/TuwaIO/siwx/blob/main/packages/siwx-core/src/types.ts#L120)

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

Defined in: [types.ts:127](https://github.com/TuwaIO/siwx/blob/main/packages/siwx-core/src/types.ts#L127)

Accepted value(s) of the message `uri`. A message URI matches an expected URI when it is equal to it,
starts with it followed by `/`, or has the same origin (scheme, host and port).

#### Example

```ts
"https://tuwa.io"
```

***

### maxIssuedAtAgeSeconds?

> `optional` **maxIssuedAtAgeSeconds?**: `number`

Defined in: [types.ts:147](https://github.com/TuwaIO/siwx/blob/main/packages/siwx-core/src/types.ts#L147)

Maximum age of the message `issuedAt`, in seconds (plus `clockSkewSeconds`). Rejects stale messages.
There is no default: when omitted, the age is not checked.

***

### maxSessionLifetimeSeconds?

> `optional` **maxSessionLifetimeSeconds?**: `number`

Defined in: [types.ts:153](https://github.com/TuwaIO/siwx/blob/main/packages/siwx-core/src/types.ts#L153)

Maximum signed session lifetime (`expirationTime - issuedAt`), in seconds. Checked only when the message
has an `expirationTime`.

***

### requireExpirationTime?

> `optional` **requireExpirationTime?**: `boolean`

Defined in: [types.ts:141](https://github.com/TuwaIO/siwx/blob/main/packages/siwx-core/src/types.ts#L141)

Rejects messages without an `expirationTime`. Recommended for the stateless demo profile of
`@tuwaio/siwx-server`.
