# server

Framework-agnostic server utilities, imported from `@tuwaio/siwx-server`.

## Classes

- [MemorySiwxNonceStore](/packages/siwx-server/server/classes/MemorySiwxNonceStore.md)
- [MemorySiwxSessionStore](/packages/siwx-server/server/classes/MemorySiwxSessionStore.md)

## Interfaces

- [CookieOptions](/packages/siwx-server/server/interfaces/CookieOptions.md)
- [GetSiwxServerSessionOptions](/packages/siwx-server/server/interfaces/GetSiwxServerSessionOptions.md)
- [ServerVerifyOptions](/packages/siwx-server/server/interfaces/ServerVerifyOptions.md)
- [ServerVerifyResult](/packages/siwx-server/server/interfaces/ServerVerifyResult.md)
- [SiwxMessageFields](/packages/siwx-server/server/interfaces/SiwxMessageFields.md)
- [SiwxNonceStore](/packages/siwx-server/server/interfaces/SiwxNonceStore.md)
- [SiwxSession](/packages/siwx-server/server/interfaces/SiwxSession.md)
- [SiwxSessionLike](/packages/siwx-server/server/interfaces/SiwxSessionLike.md)
- [SiwxSessionRecord](/packages/siwx-server/server/interfaces/SiwxSessionRecord.md)
- [SiwxSessionStore](/packages/siwx-server/server/interfaces/SiwxSessionStore.md)
- [SiwxVerificationPolicy](/packages/siwx-server/server/interfaces/SiwxVerificationPolicy.md)
- [StatelessDemoLimits](/packages/siwx-server/server/interfaces/StatelessDemoLimits.md)
- [StatelessDemoTokenPayload](/packages/siwx-server/server/interfaces/StatelessDemoTokenPayload.md)
- [ValidateMessageOptions](/packages/siwx-server/server/interfaces/ValidateMessageOptions.md)

## Type Aliases

- [ParsedSiwxMessage](/packages/siwx-server/server/type-aliases/ParsedSiwxMessage.md)

## Functions

- [createClearCookie](/packages/siwx-server/server/functions/createClearCookie.md)
- [createSessionCookie](/packages/siwx-server/server/functions/createSessionCookie.md)
- [generateServerNonce](/packages/siwx-server/server/functions/generateServerNonce.md)
- [getSiwxServerSession](/packages/siwx-server/server/functions/getSiwxServerSession.md)
- [isSessionMatchingTarget](/packages/siwx-server/server/functions/isSessionMatchingTarget.md)
- [issueStatelessDemoNonce](/packages/siwx-server/server/functions/issueStatelessDemoNonce.md)
- [parseCookie](/packages/siwx-server/server/functions/parseCookie.md)
- [signStatelessDemoSession](/packages/siwx-server/server/functions/signStatelessDemoSession.md)
- [toSession](/packages/siwx-server/server/functions/toSession.md)
- [validateMessage](/packages/siwx-server/server/functions/validateMessage.md)
- [validatePolicy](/packages/siwx-server/server/functions/validatePolicy.md)
- [verifySiwxPayload](/packages/siwx-server/server/functions/verifySiwxPayload.md)
- [verifyStatelessDemoNonce](/packages/siwx-server/server/functions/verifyStatelessDemoNonce.md)
- [verifyStatelessDemoSession](/packages/siwx-server/server/functions/verifyStatelessDemoSession.md)

## References

### generateNonce

Renames and re-exports [generateServerNonce](/packages/siwx-server/server/functions/generateServerNonce.md)
