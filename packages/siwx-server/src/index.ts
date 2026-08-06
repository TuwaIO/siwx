/**
 * @fileoverview Public API barrel for @tuwaio/siwx-server.
 *
 * @packageDocumentation
 * @module @tuwaio/siwx-server
 *
 * Backend utilities for the TUWA Sign-In With X (SIWX) ecosystem.
 * Provides server-side CAIP-122 payload verification, session serialization,
 * and nonce generation. Fully backend-agnostic — works with Next.js, NestJS, Hono, and more.
 *
 * @see {@link https://github.com/TuwaIO/siwx Repository}
 */

export {
  deserializeCookieSession,
  generateServerNonce,
  serializeCookieSession,
  toSession,
  verifySiwxPayload,
} from './server';
export type {
  CookieOptions,
  SerializedCookieSession,
  ServerVerifyOptions,
  ServerVerifyResult,
  SiwxSession,
} from './types';
