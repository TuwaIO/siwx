[**API Reference — @tuwaio/siwx (CAIP-122 Authentication Layer)**](../../README.md)

***

# siwx-core/src

## Fileoverview

Public API barrel for @tuwaio/siwx-core.

## See

 - [CAIP-122 Specification](https://github.com/ChainAgnostic/CAIPs/blob/main/CAIPs/caip-122.md)
 - [Repository](https://github.com/TuwaIO/siwx)

## Classes

- [SiwxChainNotAllowedError](classes/SiwxChainNotAllowedError.md)
- [SiwxDomainMismatchError](classes/SiwxDomainMismatchError.md)
- [SiwxError](classes/SiwxError.md)
- [SiwxExpiredSessionError](classes/SiwxExpiredSessionError.md)
- [SiwxIssuedAtFutureError](classes/SiwxIssuedAtFutureError.md)
- [SiwxIssuedAtStaleError](classes/SiwxIssuedAtStaleError.md)
- [SiwxNonceReplayError](classes/SiwxNonceReplayError.md)
- [SiwxNotBeforeError](classes/SiwxNotBeforeError.md)
- [SiwxParseError](classes/SiwxParseError.md)
- [SiwxPolicyViolationError](classes/SiwxPolicyViolationError.md)
- [SiwxSessionLifetimeExceededError](classes/SiwxSessionLifetimeExceededError.md)
- [SiwxUnsupportedNamespaceError](classes/SiwxUnsupportedNamespaceError.md)
- [SiwxUriMismatchError](classes/SiwxUriMismatchError.md)
- [SiwxValidationError](classes/SiwxValidationError.md)
- [SiwxVerificationError](classes/SiwxVerificationError.md)

## Interfaces

- [SiwxAdapter](interfaces/SiwxAdapter.md)
- [SiwxMessageFields](interfaces/SiwxMessageFields.md)
- [SiwxSessionLike](interfaces/SiwxSessionLike.md)
- [SiwxValidationResult](interfaces/SiwxValidationResult.md)
- [SiwxVerificationPolicy](interfaces/SiwxVerificationPolicy.md)
- [SiwxVerifyPayload](interfaces/SiwxVerifyPayload.md)
- [SiwxVerifyResult](interfaces/SiwxVerifyResult.md)
- [ValidateMessageOptions](interfaces/ValidateMessageOptions.md)

## Type Aliases

- [ParsedSiwxMessage](type-aliases/ParsedSiwxMessage.md)
- [SiwxChainId](type-aliases/SiwxChainId.md)
- [SiwxChainNamespace](type-aliases/SiwxChainNamespace.md)
- [SiwxStatus](type-aliases/SiwxStatus.md)

## Functions

- [buildMessage](functions/buildMessage.md)
- [generateNonce](functions/generateNonce.md)
- [isSessionMatchingTarget](functions/isSessionMatchingTarget.md)
- [parseMessage](functions/parseMessage.md)
- [validateMessage](functions/validateMessage.md)
- [validatePolicy](functions/validatePolicy.md)
