/**
 * @file React hooks for @tuwaio/siwx-react.
 */

import type { SiwxChainId, SiwxMessageFields, SiwxStatus } from '@tuwaio/siwx-core';
import { buildMessage, generateNonce } from '@tuwaio/siwx-core';
import { useCallback, useEffect } from 'react';

import type { SiwxClientSession } from './sessionStore';
import { restorePersistedSession, useSiwxSessionStore } from './sessionStore';

/**
 * Options of `signIn` returned by {@link useSiwx}.
 */
export interface UseSiwxSignInOptions {
  /**
   * Signs the CAIP-122 message with the connected wallet, for example `createEvmSiwxSigner` from
   * `@tuwaio/siwx-evm` or `createSolanaSiwxSigner` from `@tuwaio/siwx-solana`.
   *
   * @param message - The CAIP-122 message to sign.
   * @returns A promise resolving to the signature (hex for EVM, base58 for Solana).
   */
  signer: (message: string) => Promise<string>;

  /**
   * Sends the signed message to your backend, which verifies it and issues the session (for example
   * `POST /api/siwx/verify` of `@tuwaio/siwx-server/next`, which responds with the session JSON).
   *
   * @param payload - The message and signature to submit.
   * @returns A promise resolving to the verified session, or `null` when verification failed. Throwing also counts
   * as a failure.
   */
  verifier: (payload: { message: string; signature: string }) => Promise<SiwxClientSession | null>;

  /**
   * Fields of the CAIP-122 message. `version` is always `"1"`. When omitted, `nonce` comes from `getNonce` (or
   * `generateNonce` from `@tuwaio/siwx-core`), `issuedAt` is the current time and `expirationTime` is 24 hours later.
   */
  fields: Omit<SiwxMessageFields, 'nonce' | 'issuedAt' | 'version'> & {
    nonce?: string;
    issuedAt?: string;
  };

  /**
   * Fetches a challenge nonce from the backend (for example `GET /api/siwx/nonce`). Used when `fields.nonce` is
   * omitted; without it, the nonce is generated in the browser, which servers that only accept nonces they issued
   * (such as both handlers of `@tuwaio/siwx-server/next`) reject.
   *
   * @returns The nonce, or a promise resolving to it.
   */
  getNonce?: () => Promise<string> | string;

  /**
   * Called after the store has been set to `authenticated`.
   *
   * @param session - The verified session returned by `verifier`.
   */
  onSuccess?: (session: SiwxClientSession) => void;

  /**
   * Called when any step (nonce, signing, verification) fails, after the store has been set to `error`.
   *
   * @param error - The error message.
   */
  onError?: (error: string) => void;
}

/**
 * Return value of {@link useSiwx}.
 */
export interface UseSiwxReturn {
  /**
   * Runs the sign-in flow (nonce → build → sign → verify) and updates the store. The promise resolves when the flow
   * ends: failures are caught and reported through the store `error` and `onError` instead of rejecting.
   */
  signIn: (options: UseSiwxSignInOptions) => Promise<void>;
  /** Resets the store to `idle` and clears the saved session. Does not call any server endpoint. */
  signOut: () => void;
}

/**
 * React hook that runs the CAIP-122 sign-in flow and keeps its state in {@link useSiwxSessionStore}.
 *
 * `signIn` sets the store to `building`, resolves the nonce and builds the message with `buildMessage` from
 * `@tuwaio/siwx-core`, sets `signing` and asks `signer` for the signature, then sets `verifying` and passes
 * `{ message, signature }` to `verifier`. On success it sets `authenticated` with the returned session (which is
 * saved to `localStorage`) and calls `onSuccess`; on failure it sets `error` and calls `onError`. The hook performs
 * no network requests itself; your `getNonce` and `verifier` do.
 *
 * Side effect: after the first mount, restores the session saved by a previous page load (see
 * {@link useSiwxSessionStore}).
 *
 * @returns The `signIn` and `signOut` actions.
 *
 * @example
 * ```tsx
 * const { signIn, signOut } = useSiwx();
 *
 * const handleLogin = () =>
 *   signIn({
 *     signer: createEvmSiwxSigner(walletClient),
 *     getNonce: async () => (await (await fetch('/api/siwx/nonce')).json()).nonce,
 *     verifier: async (payload) => {
 *       const res = await fetch('/api/siwx/verify', { method: 'POST', body: JSON.stringify(payload) });
 *       return res.ok ? res.json() : null;
 *     },
 *     fields: {
 *       domain: window.location.host,
 *       address: `eip155:1:${address}`,
 *       uri: window.location.origin,
 *       chainId: 'eip155:1',
 *       statement: 'Sign in to TUWA.',
 *     },
 *   });
 * ```
 */
export function useSiwx(): UseSiwxReturn {
  const { setBuilding, setSigning, setVerifying, setAuthenticated, setError, reset } = useSiwxSessionStore();

  useEffect(restorePersistedSession, []);

  const signIn = useCallback(
    async (options: UseSiwxSignInOptions) => {
      const { signer, verifier, fields, getNonce, onSuccess, onError } = options;

      try {
        setBuilding();

        const nonce = fields.nonce ?? (getNonce ? await getNonce() : generateNonce());
        const issuedAt = fields.issuedAt ?? new Date().toISOString();
        const expirationTime = fields.expirationTime ?? new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString();

        const message = buildMessage({
          ...fields,
          version: '1',
          nonce,
          issuedAt,
          expirationTime,
        });

        setSigning();
        const signature = await signer(message);

        setVerifying();

        const session = await verifier({ message, signature });

        if (!session) {
          const err = 'Backend verification failed. No session returned.';
          setError(err);
          onError?.(err);
          return;
        }

        // Build a minimal ParsedSiwxMessage from the session for store compatibility
        setAuthenticated({
          domain: session.domain,
          address: session.address,
          uri: fields.uri,
          version: '1',
          chainId: session.chainId as SiwxChainId,
          nonce,
          issuedAt: session.issuedAt,
          expirationTime: session.expirationTime,
        });

        const clientSession: SiwxClientSession = {
          domain: session.domain,
          address: session.address,
          chainId: session.chainId,
          issuedAt: session.issuedAt,
          expirationTime: session.expirationTime,
        };

        onSuccess?.(clientSession);
      } catch (error) {
        const errMessage = error instanceof Error ? error.message : String(error);
        setError(errMessage);
        onError?.(errMessage);
      }
    },
    [setBuilding, setSigning, setVerifying, setAuthenticated, setError],
  );

  const signOut = useCallback(() => {
    reset();
  }, [reset]);

  return { signIn, signOut };
}

/**
 * React hook that reads the sign-in state from {@link useSiwxSessionStore}. The component re-renders when `status`,
 * `session` or `error` change.
 *
 * Side effect: after the first mount, restores the session saved by a previous page load, so the first render
 * (including server rendering) is always `idle`.
 *
 * @returns `status`, `session` and `error`, plus `isAuthenticated` (`true` when `status` is `authenticated` and a
 * session is set).
 *
 * @example
 * ```tsx
 * const { status, session, error } = useSiwxSession();
 * if (status === 'authenticated') {
 *   console.log('Signed in as:', session?.address);
 * }
 * ```
 */
export function useSiwxSession(): {
  /** Current sign-in status. */
  status: SiwxStatus;
  /** The verified session, or `null`. */
  session: SiwxClientSession | null;
  /** The last error message, or `null`. */
  error: string | null;
  /** `true` when `status` is `authenticated` and `session` is set. */
  isAuthenticated: boolean;
} {
  const status = useSiwxSessionStore((s) => s.status);
  const session = useSiwxSessionStore((s) => s.session);
  const error = useSiwxSessionStore((s) => s.error);

  useEffect(restorePersistedSession, []);

  return {
    status,
    session,
    error,
    isAuthenticated: status === 'authenticated' && session !== null,
  };
}
