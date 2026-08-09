[**API Reference — @tuwaio/siwx (CAIP-122 Authentication Layer)**](../../../README.md)

***

# deserializeCookieSession()

> **deserializeCookieSession**(`cookieValue`): [`SiwxSession`](../interfaces/SiwxSession.md) \| `null`

Defined in: [packages/siwx-server/src/server.ts:179](https://github.com/TuwaIO/siwx/blob/226309e8a8af6d2fb968b23cea6b3dc7f2a3300b/packages/siwx-server/src/server.ts#L179)

Deserializes a `SiwxSession` from a base64url-encoded cookie value.
This is the inverse of `serializeCookieSession`.

## Parameters

### cookieValue

`string`

The raw cookie value string (not the full header).

## Returns

[`SiwxSession`](../interfaces/SiwxSession.md) \| `null`

The deserialized `SiwxSession`, or `null` if the value is invalid or malformed.

## Example

```ts
const session = deserializeCookieSession(request.cookies.get('siwx-session'));
if (session) console.log('Session address:', session.address);
```
