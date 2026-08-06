[**API Reference — @tuwaio/siwx (CAIP-122 Authentication Layer)**](../../README.md)

***

# siwx-core/src

## Fileoverview

Public API barrel for @tuwaio/siwx-core.

## See

 - [CAIP-122 Specification](https://github.com/ChainAgnostic/CAIPs/blob/main/CAIPs/caip-122.md)
 - [Repository](https://github.com/TuwaIO/siwx)

## Classes

- [SiwxError](classes/SiwxError.md)
- [SiwxExpiredSessionError](classes/SiwxExpiredSessionError.md)
- [SiwxNonceReplayError](classes/SiwxNonceReplayError.md)
- [SiwxParseError](classes/SiwxParseError.md)
- [SiwxUnsupportedNamespaceError](classes/SiwxUnsupportedNamespaceError.md)
- [SiwxValidationError](classes/SiwxValidationError.md)
- [SiwxVerificationError](classes/SiwxVerificationError.md)

## Interfaces

- [SiwxAdapter](interfaces/SiwxAdapter.md)
- [SiwxMessageFields](interfaces/SiwxMessageFields.md)
- [SiwxValidationResult](interfaces/SiwxValidationResult.md)
- [SiwxVerifyPayload](interfaces/SiwxVerifyPayload.md)
- [SiwxVerifyResult](interfaces/SiwxVerifyResult.md)

## Type Aliases

- [ParsedSiwxMessage](type-aliases/ParsedSiwxMessage.md)
- [SiwxChainId](type-aliases/SiwxChainId.md)
- [SiwxChainNamespace](type-aliases/SiwxChainNamespace.md)
- [SiwxStatus](type-aliases/SiwxStatus.md)

## Functions

- [buildMessage](functions/buildMessage.md)
- [generateNonce](functions/generateNonce.md)
- [parseMessage](functions/parseMessage.md)
- [validateMessage](functions/validateMessage.md)
