# SiwxJwks

Defined in: [siwx-server/src/types.ts:342](https://github.com/TuwaIO/siwx/blob/main/packages/siwx-server/src/types.ts#L342)

JSON Web Key Set (RFC 7517) with the public keys that verify the JWTs of SIWX sessions. Serve it at a public HTTPS
URL and give that URL to the services that accept the tokens.

## Properties

### keys

> **keys**: [`SiwxPublicJwk`](/packages/siwx-server/server/interfaces/SiwxPublicJwk.md)[]

Defined in: [siwx-server/src/types.ts:344](https://github.com/TuwaIO/siwx/blob/main/packages/siwx-server/src/types.ts#L344)

The public keys.
