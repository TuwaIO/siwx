/**
 * @fileoverview Public API barrel for @tuwaio/siwx-server.
 *
 * @packageDocumentation
 * @module @tuwaio/siwx-server
 *
 * Backend utilities for the TUWA Sign-In With X (SIWX) ecosystem.
 * Provides server-side CAIP-122 payload verification, durable session store abstractions,
 * authenticated stateless demo handlers, and single-use nonce generation.
 *
 * @see {@link https://github.com/TuwaIO/siwx Repository}
 */

export {
  createClearCookie,
  createSessionCookie,
  generateServerNonce,
  MemorySiwxNonceStore,
  MemorySiwxSessionStore,
  parseCookie,
  signStatelessDemoSession,
  toSession,
  verifySiwxPayload,
  verifyStatelessDemoSession,
} from './server';
export type {
  CookieOptions,
  ServerVerifyOptions,
  ServerVerifyResult,
  SiwxNonceStore,
  SiwxSession,
  SiwxSessionRecord,
  SiwxSessionStore,
  StatelessDemoLimits,
  StatelessDemoTokenPayload,
} from './types';

// Re-export core types & helpers
export type {
  ParsedSiwxMessage,
  SiwxMessageFields,
  SiwxSessionLike,
  SiwxVerificationPolicy,
  ValidateMessageOptions,
} from '@tuwaio/siwx-core';
export { generateNonce, isSessionMatchingTarget, validateMessage, validatePolicy } from '@tuwaio/siwx-core';
