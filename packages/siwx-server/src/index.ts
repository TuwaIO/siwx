/**
 * Framework-agnostic server utilities, imported from `@tuwaio/siwx-server`.
 *
 * @module server
 */

export { signSiwxJwt, siwxJwtSubject, verifySiwxJwt } from './jwt';
export { createSiwxJwks, generateSiwxJwtKey, importSiwxJwtKey, siwxJwkThumbprint } from './jwtKeys';
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
  SiwxJwks,
  SiwxJwtAlgorithm,
  SiwxJwtKey,
  SiwxJwtOptions,
  SiwxJwtPayload,
  SiwxNonceStore,
  SiwxPublicJwk,
  SiwxSession,
  SiwxSessionRecord,
  SiwxSessionStore,
  SiwxVerificationMethod,
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
