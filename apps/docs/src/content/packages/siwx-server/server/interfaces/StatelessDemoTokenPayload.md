# StatelessDemoTokenPayload

Defined in: [siwx-server/src/types.ts:153](https://github.com/TuwaIO/siwx/blob/main/packages/siwx-server/src/types.ts#L153)

JSON payload of a stateless demo session token (see [signStatelessDemoSession](/packages/siwx-server/server/functions/signStatelessDemoSession.md)). The token is signed, not
encrypted: anyone holding it can read these fields.

## Properties

### address

> **address**: `string`

Defined in: [siwx-server/src/types.ts:157](https://github.com/TuwaIO/siwx/blob/main/packages/siwx-server/src/types.ts#L157)

CAIP-10 account ID of the session.

***

### chainId

> **chainId**: `string`

Defined in: [siwx-server/src/types.ts:159](https://github.com/TuwaIO/siwx/blob/main/packages/siwx-server/src/types.ts#L159)

CAIP-2 chain ID of the session.

***

### domain

> **domain**: `string`

Defined in: [siwx-server/src/types.ts:161](https://github.com/TuwaIO/siwx/blob/main/packages/siwx-server/src/types.ts#L161)

Domain of the signed message.

***

### expirationTime?

> `optional` **expirationTime?**: `string`

Defined in: [siwx-server/src/types.ts:167](https://github.com/TuwaIO/siwx/blob/main/packages/siwx-server/src/types.ts#L167)

Expiry of the token: the message `expirationTime`, or the issuing time plus the token TTL.

***

### issuedAt

> **issuedAt**: `string`

Defined in: [siwx-server/src/types.ts:165](https://github.com/TuwaIO/siwx/blob/main/packages/siwx-server/src/types.ts#L165)

`issuedAt` of the signed message.

***

### mode

> **mode**: `"demo"`

Defined in: [siwx-server/src/types.ts:171](https://github.com/TuwaIO/siwx/blob/main/packages/siwx-server/src/types.ts#L171)

Token mode.

***

### nonce

> **nonce**: `string`

Defined in: [siwx-server/src/types.ts:163](https://github.com/TuwaIO/siwx/blob/main/packages/siwx-server/src/types.ts#L163)

Nonce of the signed message.

***

### sessionId

> **sessionId**: `string`

Defined in: [siwx-server/src/types.ts:169](https://github.com/TuwaIO/siwx/blob/main/packages/siwx-server/src/types.ts#L169)

Random ID of the token.

***

### version

> **version**: `1`

Defined in: [siwx-server/src/types.ts:155](https://github.com/TuwaIO/siwx/blob/main/packages/siwx-server/src/types.ts#L155)

Token format version.
