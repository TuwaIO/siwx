/**
 * @fileoverview Public API barrel for @tuwaio/siwx-core.
 *
 * @packageDocumentation
 * @module @tuwaio/siwx-core
 *
 * The core foundation of the TUWA Sign-In With X (SIWX) ecosystem.
 * Provides chain-agnostic CAIP-122 message building, parsing, and validation.
 *
 * @see {@link https://github.com/ChainAgnostic/CAIPs/blob/main/CAIPs/caip-122.md CAIP-122 Specification}
 * @see {@link https://github.com/TuwaIO/siwx Repository}
 */

export { buildMessage } from './buildMessage';
export {
  SiwxError,
  SiwxExpiredSessionError,
  SiwxNonceReplayError,
  SiwxParseError,
  SiwxUnsupportedNamespaceError,
  SiwxValidationError,
  SiwxVerificationError,
} from './errors';
export { parseMessage } from './parseMessage';
export type {
  ParsedSiwxMessage,
  SiwxAdapter,
  SiwxChainId,
  SiwxChainNamespace,
  SiwxMessageFields,
  SiwxStatus,
  SiwxValidationResult,
  SiwxVerifyPayload,
  SiwxVerifyResult,
} from './types';
export { generateNonce, validateMessage } from './validateMessage';
