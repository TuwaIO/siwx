/**
 * Framework-agnostic server utilities, imported from `@tuwaio/siwx-server`.
 *
 * @module server
 */

export {
  createClearCookie,
  createSessionCookie,
  generateServerNonce,
  getSiwxServerSession,
  issueStatelessDemoNonce,
  MemorySiwxNonceStore,
  MemorySiwxSessionStore,
  parseCookie,
  signStatelessDemoSession,
  toSession,
  verifySiwxPayload,
  verifyStatelessDemoNonce,
  verifyStatelessDemoSession,
} from './server';
export type {
  CookieOptions,
  GetSiwxServerSessionOptions,
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
