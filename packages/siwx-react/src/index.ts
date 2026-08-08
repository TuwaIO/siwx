/**
 * @fileoverview Public API barrel for @tuwaio/siwx-react.
 *
 * @packageDocumentation
 * @module @tuwaio/siwx-react
 *
 * React bindings for the TUWA Sign-In With X (SIWX) ecosystem.
 * Provides a Zustand-powered session store and hooks for managing the
 * full CAIP-122 authentication lifecycle on the client side.
 *
 * Completely independent of any backend SDK — session persistence uses
 * sessionStorage and is backend-agnostic.
 *
 * @see {@link https://github.com/TuwaIO/siwx Repository}
 */

export type { UseSiwxReturn, UseSiwxSignInOptions } from './hooks';
export { useSiwx, useSiwxSession } from './hooks';
export type { MinimalSatelliteConnection, SatelliteSiwxFieldOptions } from './satelliteHelpers';
export { createSatelliteSiwxSigner, getSatelliteSiwxFields, isSessionMatchingConnection } from './satelliteHelpers';
export type { SiwxClientSession, SiwxSessionActions, SiwxSessionState, SiwxSessionStore } from './sessionStore';
export { useSiwxSessionStore } from './sessionStore';

// Re-export common types from siwx-core for convenience
export type { ParsedSiwxMessage, SiwxMessageFields, SiwxStatus } from '@tuwaio/siwx-core';
