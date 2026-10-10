# siwxJwtSubject()

> **siwxJwtSubject**(`session`, `subjectId?`): `string`

Defined in: [siwx-server/src/jwt.ts:60](https://github.com/TuwaIO/siwx/blob/main/packages/siwx-server/src/jwt.ts#L60)

Returns the default `sub` of the JWT of a session: a stable ID of the user for the service that receives the token.

- `subjectId`, when set and not empty (your own user ID, bound with `SiwxSessionStore.bindSubject`);
- an EVM account that signed with its own key (`verificationMethod` `eip191`): the account without its chain,
  `eip155:<address in lowercase>`, so signing in on another network is the same user;
- an EVM smart contract wallet (`eip1271`, `erc6492`) or an EVM session without `verificationMethod`: the account
  with its chain, `eip155:<chain>:<address in lowercase>`. A contract wallet is controlled on each chain
  separately: the same address can have other owners on another network;
- a Solana account: `solana:<address>` (base58 is case-sensitive and kept as is) under either form of its chain ID;
  `<namespace>:<address>` otherwise.

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
siwxJwtSubject({ ...session, address: 'eip155:8453:0xAbC…', verificationMethod: 'eip191' }); // "eip155:0xabc…"
siwxJwtSubject({ ...session, address: 'eip155:8453:0xAbC…', verificationMethod: 'eip1271' }); // "eip155:8453:0xabc…"
```
