[**API Reference — @tuwaio/siwx (CAIP-122 Authentication Layer)**](../../README.md)

***

# siwx-server/src

## Fileoverview

Public API barrel for @tuwaio/siwx-server.

## See

[Repository](https://github.com/TuwaIO/siwx)

## Classes

- [MemorySiwxNonceStore](classes/MemorySiwxNonceStore.md)
- [MemorySiwxSessionStore](classes/MemorySiwxSessionStore.md)

## Interfaces

- [CookieOptions](interfaces/CookieOptions.md)
- [ServerVerifyOptions](interfaces/ServerVerifyOptions.md)
- [ServerVerifyResult](interfaces/ServerVerifyResult.md)
- [SiwxNonceStore](interfaces/SiwxNonceStore.md)
- [SiwxSession](interfaces/SiwxSession.md)
- [SiwxSessionRecord](interfaces/SiwxSessionRecord.md)
- [SiwxSessionStore](interfaces/SiwxSessionStore.md)
- [SiwxVerificationPolicy](interfaces/SiwxVerificationPolicy.md)
- [StatelessDemoLimits](interfaces/StatelessDemoLimits.md)
- [StatelessDemoTokenPayload](interfaces/StatelessDemoTokenPayload.md)
- [ValidateMessageOptions](interfaces/ValidateMessageOptions.md)

## Functions

- [createClearCookie](functions/createClearCookie.md)
- [createSessionCookie](functions/createSessionCookie.md)
- [generateServerNonce](functions/generateServerNonce.md)
- [parseCookie](functions/parseCookie.md)
- [signStatelessDemoSession](functions/signStatelessDemoSession.md)
- [toSession](functions/toSession.md)
- [validateMessage](functions/validateMessage.md)
- [validatePolicy](functions/validatePolicy.md)
- [verifySiwxPayload](functions/verifySiwxPayload.md)
- [verifyStatelessDemoSession](functions/verifyStatelessDemoSession.md)

## References

### generateNonce

Renames and re-exports [generateServerNonce](functions/generateServerNonce.md)

***

### isSessionMatchingTarget

Re-exports [isSessionMatchingTarget](../../siwx-react/src/functions/isSessionMatchingTarget.md)

***

### ParsedSiwxMessage

Re-exports [ParsedSiwxMessage](../../siwx-react/src/type-aliases/ParsedSiwxMessage.md)

***

### SiwxMessageFields

Re-exports [SiwxMessageFields](../../siwx-react/src/interfaces/SiwxMessageFields.md)

***

### SiwxSessionLike

Re-exports [SiwxSessionLike](../../siwx-react/src/interfaces/SiwxSessionLike.md)
