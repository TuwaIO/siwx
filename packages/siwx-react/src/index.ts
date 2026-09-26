export type { UseSiwxReturn, UseSiwxSignInOptions } from './hooks';
export { useSiwx, useSiwxSession } from './hooks';
export type { MinimalSatelliteConnection, SatelliteSiwxFieldOptions } from './satelliteHelpers';
export { createSatelliteSiwxSigner, getSatelliteSiwxFields, isSessionMatchingConnection } from './satelliteHelpers';
export type { SiwxClientSession, SiwxSessionActions, SiwxSessionState, SiwxSessionStore } from './sessionStore';
export { useSiwxSessionStore } from './sessionStore';

// Re-export common types and utilities from siwx-core for convenience
export type { ParsedSiwxMessage, SiwxMessageFields, SiwxSessionLike, SiwxStatus } from '@tuwaio/siwx-core';
export { isSessionMatchingTarget } from '@tuwaio/siwx-core';
