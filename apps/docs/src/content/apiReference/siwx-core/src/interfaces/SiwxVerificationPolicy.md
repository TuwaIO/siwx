[**API Reference — @tuwaio/siwx (CAIP-122 Authentication Layer)**](../../../README.md)

***

# SiwxVerificationPolicy

Defined in: [packages/siwx-core/src/types.ts:104](https://github.com/TuwaIO/siwx/blob/0ca0708dd74b07eb7d1d46e0b3ebb6c65b68bbc8/packages/siwx-core/src/types.ts#L104)

Policy parameters for server-side CAIP-122 message verification.
Enforces strict security constraints including domain, URI, chain ID, and timing windows.

## Properties

### allowedChainIds?

> `optional` **allowedChainIds?**: `string`[]

Defined in: [packages/siwx-core/src/types.ts:118](https://github.com/TuwaIO/siwx/blob/0ca0708dd74b07eb7d1d46e0b3ebb6c65b68bbc8/packages/siwx-core/src/types.ts#L118)

List of allowed CAIP-2 chain IDs (e.g. ["eip155:1", "solana:5eykt4UsFv8P8NJdTREpY1vzqKqZKvdpK"]).

***

### clockSkewSeconds?

> `optional` **clockSkewSeconds?**: `number`

Defined in: [packages/siwx-core/src/types.ts:142](https://github.com/TuwaIO/siwx/blob/0ca0708dd74b07eb7d1d46e0b3ebb6c65b68bbc8/packages/siwx-core/src/types.ts#L142)

Allowed clock skew in seconds when validating timestamps.

#### Default

```ts
60 (1 minute)
```

***

### enforceNotBefore?

> `optional` **enforceNotBefore?**: `boolean`

Defined in: [packages/siwx-core/src/types.ts:148](https://github.com/TuwaIO/siwx/blob/0ca0708dd74b07eb7d1d46e0b3ebb6c65b68bbc8/packages/siwx-core/src/types.ts#L148)

Whether to enforce the `notBefore` timestamp if present in the message.

#### Default

```ts
true
```

***

### expectedDomain?

> `optional` **expectedDomain?**: `string` \| `string`[]

Defined in: [packages/siwx-core/src/types.ts:108](https://github.com/TuwaIO/siwx/blob/0ca0708dd74b07eb7d1d46e0b3ebb6c65b68bbc8/packages/siwx-core/src/types.ts#L108)

Expected domain(s) requesting sign-in (e.g. "tuwa.io" or ["tuwa.io", "staging.tuwa.io"]).

***

### expectedUri?

> `optional` **expectedUri?**: `string` \| `string`[]

Defined in: [packages/siwx-core/src/types.ts:113](https://github.com/TuwaIO/siwx/blob/0ca0708dd74b07eb7d1d46e0b3ebb6c65b68bbc8/packages/siwx-core/src/types.ts#L113)

Expected RFC 3986 URI(s) subject of sign-in (e.g. "https://tuwa.io").

***

### maxIssuedAtAgeSeconds?

> `optional` **maxIssuedAtAgeSeconds?**: `number`

Defined in: [packages/siwx-core/src/types.ts:131](https://github.com/TuwaIO/siwx/blob/0ca0708dd74b07eb7d1d46e0b3ebb6c65b68bbc8/packages/siwx-core/src/types.ts#L131)

Maximum allowed age of the message's `issuedAt` in seconds.
Prevents accepting stale sign-in messages.

#### Default

```ts
300 (5 minutes)
```

***

### maxSessionLifetimeSeconds?

> `optional` **maxSessionLifetimeSeconds?**: `number`

Defined in: [packages/siwx-core/src/types.ts:136](https://github.com/TuwaIO/siwx/blob/0ca0708dd74b07eb7d1d46e0b3ebb6c65b68bbc8/packages/siwx-core/src/types.ts#L136)

Maximum allowed session lifetime in seconds (expirationTime - issuedAt).

***

### requireExpirationTime?

> `optional` **requireExpirationTime?**: `boolean`

Defined in: [packages/siwx-core/src/types.ts:124](https://github.com/TuwaIO/siwx/blob/0ca0708dd74b07eb7d1d46e0b3ebb6c65b68bbc8/packages/siwx-core/src/types.ts#L124)

Whether the CAIP-122 message MUST include an `expirationTime`.
Strongly recommended for zero-infrastructure stateless demo profiles.
