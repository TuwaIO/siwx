# StatelessDemoTokenPayload

Defined in: [siwx-server/src/types.ts:174](https://github.com/TuwaIO/siwx/blob/main/packages/siwx-server/src/types.ts#L174)

JSON payload of a stateless demo session token (see [signStatelessDemoSession](/packages/siwx-server/server/functions/signStatelessDemoSession.md)). The token is signed, not
encrypted: anyone holding it can read these fields.

## Properties

### address

> **address**: `string`

Defined in: [siwx-server/src/types.ts:178](https://github.com/TuwaIO/siwx/blob/main/packages/siwx-server/src/types.ts#L178)

CAIP-10 account ID of the session.

***

### chainId

> **chainId**: `string`

Defined in: [siwx-server/src/types.ts:180](https://github.com/TuwaIO/siwx/blob/main/packages/siwx-server/src/types.ts#L180)

CAIP-2 chain ID of the session.

***

### domain

> **domain**: `string`

Defined in: [siwx-server/src/types.ts:182](https://github.com/TuwaIO/siwx/blob/main/packages/siwx-server/src/types.ts#L182)

Domain of the signed message.

***

### expirationTime?

> `optional` **expirationTime?**: `string`

Defined in: [siwx-server/src/types.ts:188](https://github.com/TuwaIO/siwx/blob/main/packages/siwx-server/src/types.ts#L188)

Expiry of the token: the message `expirationTime`, or the issuing time plus the token TTL.

***

### issuedAt

> **issuedAt**: `string`

Defined in: [siwx-server/src/types.ts:186](https://github.com/TuwaIO/siwx/blob/main/packages/siwx-server/src/types.ts#L186)

`issuedAt` of the signed message.

***

### mode

> **mode**: `"demo"`

Defined in: [siwx-server/src/types.ts:192](https://github.com/TuwaIO/siwx/blob/main/packages/siwx-server/src/types.ts#L192)

Token mode.

***

### nonce

> **nonce**: `string`

Defined in: [siwx-server/src/types.ts:184](https://github.com/TuwaIO/siwx/blob/main/packages/siwx-server/src/types.ts#L184)

Nonce of the signed message.

***

### sessionId

> **sessionId**: `string`

Defined in: [siwx-server/src/types.ts:190](https://github.com/TuwaIO/siwx/blob/main/packages/siwx-server/src/types.ts#L190)

Random ID of the token.

***

### version

> **version**: `1`

Defined in: [siwx-server/src/types.ts:176](https://github.com/TuwaIO/siwx/blob/main/packages/siwx-server/src/types.ts#L176)

Token format version.
