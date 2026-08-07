/**
 * @fileoverview React hooks for @tuwaio/siwx-react.
 */

import type { SiwxChainId, SiwxMessageFields, SiwxStatus } from '@tuwaio/siwx-core';
import { buildMessage, generateNonce } from '@tuwaio/siwx-core';
import { useCallback } from 'react';

import type { SiwxClientSession } from './sessionStore';
import { useSiwxSessionStore } from './sessionStore';

/**
 * Options for the `useSiwx` hook's `signIn` function.
 */
export interface UseSiwxSignInOptions {
  /**
   * A function that accepts the formatted CAIP-122 message string and returns the signature.
   * This is where you integrate with your wallet connector (e.g., satellite, wagmi, gill).
   *
   * @param message - The formatted CAIP-122 message ready for signing.
   * @returns A promise resolving to the hex/base58-encoded signature string.
   */
  signer: (message: string) => Promise<string>;

  /**
   * A function that submits the `{ message, signature }` payload to your backend
   * for verification and issues a session (cookie/JWT).
   * The function should return the parsed session on success.
   *
   * @param payload - The message and signature to submit.
   * @returns A promise resolving to the session, or throwing/returning null on failure.
   */
  verifier: (payload: { message: string; signature: string }) => Promise<SiwxClientSession | null>;

  /**
   * The fields to build the CAIP-122 message with.
   * `nonce` and `issuedAt` are auto-generated if not provided.
   */
  fields: Omit<SiwxMessageFields, 'nonce' | 'issuedAt' | 'version'> & {
    nonce?: string;
    issuedAt?: string;
  };
}

/**
 * Return value of the `useSiwx` hook.
 */
export interface UseSiwxReturn {
  /** Initiates the full Sign-In With X flow: build → sign → verify. */
  signIn: (options: UseSiwxSignInOptions) => Promise<void>;
  /** Clears the current session. Does NOT hit any logout endpoint. */
  signOut: () => void;
}

/**
 * The primary hook for triggering the full CAIP-122 Sign-In With X flow.
 * Orchestrates: message building → wallet signing → backend verification → session storage.
 *
 * @returns `signIn` and `signOut` actions.
 *
 * @example
 * ```tsx
 * import { useSiwx } from '@tuwaio/siwx-react';
 * import { createEvmSiwxSigner } from '@tuwaio/siwx-evm';
 *
 * const { signIn, signOut } = useSiwx();
 *
 * const handleLogin = () =>
 *   signIn({
 *     signer: createEvmSiwxSigner(walletClient),
 *     verifier: async (payload) => {
 *       const res = await fetch('/api/siwx/verify', {
 *         method: 'POST',
 *         body: JSON.stringify(payload),
 *       });
 *       return res.ok ? res.json() : null;
 *     },
 *     fields: {
 *       domain: 'app.tuwa.io',
 *       address: `eip155:1:${address}`,
 *       uri: 'https://app.tuwa.io',
 *       chainId: 'eip155:1',
 *       statement: 'Sign in to TUWA.',
 *     },
 *   });
 * ```
 */
export function useSiwx(): UseSiwxReturn {
  const { setSigning, setVerifying, setAuthenticated, setError, reset } = useSiwxSessionStore();

  const signIn = useCallback(
    async (options: UseSiwxSignInOptions) => {
      const { signer, verifier, fields } = options;

      try {
        setSigning();

        const nonce = fields.nonce ?? generateNonce();
        const issuedAt = fields.issuedAt ?? new Date().toISOString();

        const message = buildMessage({
          ...fields,
          version: '1',
          nonce,
          issuedAt,
        });

        const signature = await signer(message);

        setVerifying();

        const session = await verifier({ message, signature });

        if (!session) {
          setError('Backend verification failed. No session returned.');
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
      } catch (error) {
        setError(error instanceof Error ? error.message : String(error));
      }
    },
    [setSigning, setVerifying, setAuthenticated, setError],
  );

  const signOut = useCallback(() => {
    reset();
  }, [reset]);

  return { signIn, signOut };
}

/**
 * A selector hook that returns the current SIWX session state.
 * Provides the current status, active session, and any error.
 *
 * @returns The current session state from the Zustand store.
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
  status: SiwxStatus;
  session: SiwxClientSession | null;
  error: string | null;
  isAuthenticated: boolean;
} {
  const status = useSiwxSessionStore((s) => s.status);
  const session = useSiwxSessionStore((s) => s.session);
  const error = useSiwxSessionStore((s) => s.error);

  return {
    status,
    session,
    error,
    isAuthenticated: status === 'authenticated' && session !== null,
  };
}
