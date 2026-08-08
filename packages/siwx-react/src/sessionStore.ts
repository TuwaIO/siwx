/**
 * @fileoverview Zustand session store for @tuwaio/siwx-react.
 * Manages the complete CAIP-122 authentication lifecycle client-side,
 * completely independent of any backend or SDK (e.g., Quasar).
 */

import type { ParsedSiwxMessage, SiwxStatus } from '@tuwaio/siwx-core';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';

/**
 * The shape of a client-side SIWX session.
 */
export interface SiwxClientSession {
  /** The verified CAIP-10 blockchain address. */
  address: string;
  /** The CAIP-2 chain ID the session is bound to. */
  chainId: string;
  /** ISO 8601 datetime when the session was issued. */
  issuedAt: string;
  /** ISO 8601 datetime when the session expires, if set. */
  expirationTime?: string;
  /** The domain the session was issued for. */
  domain: string;
}

/**
 * The shape of the siwx session Zustand store state.
 */
export interface SiwxSessionState {
  /** Current authentication status. */
  status: SiwxStatus;
  /** The active session, present when `status` is 'authenticated'. */
  session: SiwxClientSession | null;
  /** The last error message, present when `status` is 'error'. */
  error: string | null;
}

/**
 * Actions available on the siwx session Zustand store.
 */
export interface SiwxSessionActions {
  /**
   * Sets the store into the `signing` state.
   * Call this before triggering the wallet sign request.
   */
  setSigning: () => void;

  /**
   * Sets the store into the `verifying` state.
   * Call this after the user has signed but before server verification.
   */
  setVerifying: () => void;

  /**
   * Sets the store to `authenticated` and stores the session.
   * @param parsed - The verified parsed CAIP-122 message.
   */
  setAuthenticated: (parsed: ParsedSiwxMessage) => void;

  /**
   * Sets the store to `error` state with a message.
   * @param error - Human-readable error description.
   */
  setError: (error: string) => void;

  /**
   * Resets the store to `idle` and clears all session data.
   * Use this to log the user out.
   */
  reset: () => void;
}

/** Combined store type */
export type SiwxSessionStore = SiwxSessionState & SiwxSessionActions;

const INITIAL_STATE: SiwxSessionState = {
  status: 'idle',
  session: null,
  error: null,
};

/**
 * The primary Zustand store for SIWX session management.
 * Uses `persist` middleware to survive page reloads (sessionStorage by default),
 * and `immer` middleware for clean immutable updates.
 *
 * @remarks
 * This store is completely independent of any backend SDK.
 * It tracks the client-side authentication state only.
 * Session validity against a backend is the responsibility of individual hooks.
 */
export const useSiwxSessionStore = create<SiwxSessionStore>()(
  persist(
    immer((set) => ({
      ...INITIAL_STATE,

      setSigning: () =>
        set((state) => {
          state.status = 'signing';
          state.error = null;
        }),

      setVerifying: () =>
        set((state) => {
          state.status = 'verifying';
          state.error = null;
        }),

      setAuthenticated: (parsed: ParsedSiwxMessage) =>
        set((state) => {
          state.status = 'authenticated';
          state.error = null;
          state.session = {
            address: parsed.address,
            chainId: parsed.chainId,
            issuedAt: parsed.issuedAt,
            expirationTime: parsed.expirationTime,
            domain: parsed.domain,
          };
        }),

      setError: (error: string) =>
        set((state) => {
          state.status = 'error';
          state.error = error;
        }),

      reset: () =>
        set((state) => {
          state.status = 'idle';
          state.session = null;
          state.error = null;
        }),
    })),
    {
      name: 'tuwa-siwx-session',
      storage: createJSONStorage(() => (typeof window !== 'undefined' ? sessionStorage : ({} as Storage))),
      partialize: (state) => ({ session: state.session, status: state.status }),
    },
  ),
);
