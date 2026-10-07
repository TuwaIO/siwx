# SiwxJwtAlgorithm

> **SiwxJwtAlgorithm** = `"ES256"` \| `"RS256"`

Defined in: [siwx-server/src/types.ts:277](https://github.com/TuwaIO/siwx/blob/main/packages/siwx-server/src/types.ts#L277)

JWS algorithm of the JWTs issued for SIWX sessions: `ES256` (ECDSA with P-256 and SHA-256) or `RS256`
(RSASSA-PKCS1-v1_5 with SHA-256). Both are accepted by embedded wallet providers with custom authentication, such
as Coinbase CDP.
