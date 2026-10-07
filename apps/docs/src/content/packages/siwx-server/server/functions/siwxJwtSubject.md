# siwxJwtSubject()

> **siwxJwtSubject**(`session`, `subjectId?`): `string`

Defined in: [siwx-server/src/jwt.ts:55](https://github.com/TuwaIO/siwx/blob/main/packages/siwx-server/src/jwt.ts#L55)

Returns the default `sub` of the JWT of a session: a stable ID of the user, so that signing in on another network
does not look like another user to the service that receives the token.

- `subjectId`, when set and not empty (your own user ID, bound with `SiwxSessionStore.bindSubject`);
- otherwise the account without its chain reference: `eip155:<address in lowercase>` for EVM,
  `solana:<address>` for Solana (base58 is case-sensitive and kept as is), `<namespace>:<address>` otherwise.

Pure function.

## Parameters

### session

[`SiwxSession`](/packages/siwx-server/server/interfaces/SiwxSession.md)

The session of the signed-in wallet.

### subjectId?

`string`

The user ID bound to the session, if any.

## Returns

`string`

The subject.

## Throws

If `subjectId` is not set and the session address is not a CAIP-10 account ID.

## Example

```ts
siwxJwtSubject({ ...session, address: 'eip155:8453:0xAbC…' }); // "eip155:0xabc…"
```
