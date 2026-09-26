/**
 * @file Zustand session store for @tuwaio/siwx-react.
 * Manages the complete CAIP-122 authentication lifecycle client-side,
 * completely independent of any backend or SDK (e.g., Quasar).
 */

import type { ParsedSiwxMessage, SiwxStatus } from '@tuwaio/siwx-core';
import { create } from 'zustand';
import { createJSONStorage, persist, type PersistStorage, type StateStorage } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';

/**
 * Client-side view of a verified SIWX session. The JSON returned by the `verify` and `session` endpoints of
 * `@tuwaio/siwx-server/next` has these fields. It is display state only, never proof of identity.
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
 * State of {@link useSiwxSessionStore}.
 */
export interface SiwxSessionState {
  /** Current sign-in status. Starts as `idle`. */
  status: SiwxStatus;
  /** The verified session. Set when `status` becomes `authenticated`; cleared by `reset`. */
  session: SiwxClientSession | null;
  /** The last error message. Set when `status` is `error`; cleared by the other actions. */
  error: string | null;
}

/**
 * Actions of {@link useSiwxSessionStore}. {@link useSiwx} calls them for you; call them directly only to drive
 * a custom sign-in flow.
 */
export interface SiwxSessionActions {
  /**
   * Sets the store into the `building` state (getting the nonce and building the message).
   * Call this when a sign-in starts.
   */
  setBuilding: () => void;

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
   * Sets the store to `authenticated` and stores `address`, `chainId`, `issuedAt`, `expirationTime` and `domain` of
   * the message as the session.
   * @param parsed - The verified CAIP-122 message.
   */
  setAuthenticated: (parsed: ParsedSiwxMessage) => void;

  /**
   * Sets the store to `error` with a message. The current `session` is kept.
   * @param error - Human-readable error description.
   */
  setError: (error: string) => void;

  /**
   * Resets the store to `idle` and clears the session and error. Does not call the server; clear the server session
   * cookie separately (for example `DELETE /api/siwx/session`).
   */
  reset: () => void;
}

/** State and actions of {@link useSiwxSessionStore}. */
export type SiwxSessionStore = SiwxSessionState & SiwxSessionActions;

const INITIAL_STATE: SiwxSessionState = {
  status: 'idle',
  session: null,
  error: null,
};

/** `localStorage` key of the persisted session. */
const SESSION_STORAGE_KEY = 'siwx-react:session';

/** Storage used when `localStorage` is unavailable (server rendering, blocked storage): stores nothing. */
const noopStorage: StateStorage = {
  getItem: () => null,
  setItem: () => undefined,
  removeItem: () => undefined,
};

/**
 * Returns `localStorage`, or a storage that keeps nothing when it cannot be used.
 * @internal
 */
function getSessionStorage(): StateStorage {
  try {
    return typeof window !== 'undefined' && window.localStorage ? window.localStorage : noopStorage;
  } catch {
    return noopStorage;
  }
}

/**
 * Checks that a persisted value is a complete session that has not expired.
 * @internal
 */
function isRestorableSession(value: unknown): value is SiwxClientSession {
  if (!value || typeof value !== 'object') return false;
  const { address, chainId, domain, issuedAt, expirationTime } = value as Record<string, unknown>;
  if ([address, chainId, domain, issuedAt].some((field) => typeof field !== 'string')) return false;
  if (expirationTime === undefined) return true;
  if (typeof expirationTime !== 'string') return false;
  const expiresAt = Date.parse(expirationTime);
  return !Number.isNaN(expiresAt) && expiresAt > Date.now();
}

/** Part of the state that is saved to storage. */
type PersistedSession = Pick<SiwxSessionState, 'session'>;

const jsonStorage = createJSONStorage<PersistedSession>(getSessionStorage);

/**
 * Persist storage that ignores writes until the stored session has been restored, so that an early `reset` or
 * `setError` cannot erase it.
 * @internal
 */
const sessionPersistStorage: PersistStorage<PersistedSession> = {
  getItem: (name) => jsonStorage?.getItem(name) ?? null,
  setItem: (name, value) => {
    if (useSiwxSessionStore.persist.hasHydrated()) jsonStorage?.setItem(name, value);
  },
  removeItem: (name) => jsonStorage?.removeItem(name),
};

/**
 * Zustand store (with the `immer` and `persist` middlewares) that holds the client-side SIWX sign-in state. Use it
 * as a hook, optionally with a selector: `useSiwxSessionStore((state) => state.session)`.
 *
 * @remarks
 * The authenticated session is saved to `localStorage` under the key `siwx-react:session` and cleared by `reset`.
 * It is restored after a page reload when {@link useSiwx} or {@link useSiwxSession} first mounts (not during
 * server rendering, so there is no hydration mismatch), unless its `expirationTime` has passed; outside React call
 * `useSiwxSessionStore.persist.rehydrate()`. Only the session is saved, never the status of a sign-in in progress.
 *
 * The store is a module-level singleton shared by every component, and it is UI state only: servers must verify
 * the session cookie, never trust this store.
 */
export const useSiwxSessionStore = create<SiwxSessionStore>()(
  persist(
    immer((set) => ({
      ...INITIAL_STATE,

      setBuilding: () =>
        set((state) => {
          state.status = 'building';
          state.error = null;
        }),

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
      name: SESSION_STORAGE_KEY,
      storage: sessionPersistStorage,
      // Persist only a verified session, never a sign-in in progress.
      partialize: (state) => ({ session: state.status === 'authenticated' ? state.session : null }),
      // Restore a stored session only into an idle store, and only while it has not expired.
      merge: (persisted, current) => {
        const session = (persisted as Partial<SiwxSessionState> | undefined)?.session;
        if (current.status !== 'idle' || !isRestorableSession(session)) return current;
        return { ...current, status: 'authenticated', session, error: null };
      },
      // Hydrated after mount by the hooks, so server and first client render match.
      skipHydration: true,
    },
  ),
);

/**
 * Restores the persisted session once per page load. Called by the hooks after mount.
 * Side effect: reads `localStorage` and may set the store to `authenticated`.
 * @internal
 */
export function restorePersistedSession(): void {
  if (!useSiwxSessionStore.persist.hasHydrated()) {
    void useSiwxSessionStore.persist.rehydrate();
  }
}
