/**
 * @fileoverview Satellite Connect helpers for SIWX auto-authentication and signer generation.
 * Uses dynamic imports to lazily load chain-specific signers (`@tuwaio/siwx-evm` or `@tuwaio/siwx-solana`)
 * ensuring `@tuwaio/siwx-react` remains completely tree-shakeable and lightweight.
 */

import { useEffect, useRef } from 'react';

import type { UseSiwxSignInOptions } from './hooks';
import { useSiwx, useSiwxSession } from './hooks';

/**
 * Duck-typed interface for a Satellite Connection to avoid strict dependency on `@tuwaio/satellite-core`.
 */
export interface MinimalSatelliteConnection {
  isConnected?: boolean;
  address?: string;
  chainId?: string | number;
  connector?: {
    getWalletClient?: () => Promise<unknown>;
  };
  connectedAccount?: unknown;
  connectedWallet?: unknown;
}

/**
 * Options for generating Satellite SIWX fields.
 */
export interface SatelliteSiwxFieldOptions {
  domain?: string;
  uri?: string;
  statement?: string;
}

/**
 * Generates exact CAIP-10 and CAIP-2 identifiers strictly from the active connection.
 */
export function getSatelliteSiwxFields(
  activeConnection: MinimalSatelliteConnection,
  options?: SatelliteSiwxFieldOptions,
) {
  if (!activeConnection.address || !activeConnection.chainId) {
    throw new Error('[SIWX-REACT] Connection missing address or chainId.');
  }

  const isEvm =
    activeConnection.address.startsWith('0x') ||
    typeof activeConnection.chainId === 'number' ||
    !!activeConnection.connector;

  const caip2ChainId = isEvm ? `eip155:${activeConnection.chainId}` : `solana:${activeConnection.chainId}`;

  const caip10Address = `${caip2ChainId}:${activeConnection.address}`;

  return {
    domain: options?.domain ?? (typeof window !== 'undefined' ? window.location.host : ''),
    uri: options?.uri ?? (typeof window !== 'undefined' ? window.location.href : ''),
    statement: options?.statement,
    address: caip10Address,
    // Type assertion is safe here as the structure matches SiwxChainId
    chainId: caip2ChainId as never,
  };
}

/**
 * Inspects a Satellite connection and dynamically loads the appropriate EVM or Solana SIWX signer.
 */
export async function createSatelliteSiwxSigner(
  activeConnection: MinimalSatelliteConnection,
): Promise<(message: string) => Promise<string>> {
  if (!activeConnection.address) {
    throw new Error('[SIWX-REACT] Connection missing address.');
  }

  const isEvm =
    activeConnection.address.startsWith('0x') ||
    typeof activeConnection.chainId === 'number' ||
    !!activeConnection.connector;

  if (isEvm) {
    if (!activeConnection.connector || !activeConnection.connector.getWalletClient) {
      throw new Error('[SIWX-REACT] EVM connection missing standard connector (getWalletClient).');
    }
    // Lazy load EVM signer
    const { createEvmSiwxSigner } = await import('@tuwaio/siwx-evm');
    const walletClient = await activeConnection.connector.getWalletClient();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return createEvmSiwxSigner(walletClient as any);
  } else {
    // Lazy load Solana signer
    const signerTarget = activeConnection.connectedAccount || activeConnection.connectedWallet || activeConnection;
    const { createSolanaSiwxSigner } = await import('@tuwaio/siwx-solana');
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return createSolanaSiwxSigner(signerTarget as any);
  }
}

/**
 * Configuration options for the auto-auth hook.
 */
export interface UseSatelliteSiwxAutoAuthOptions extends SatelliteSiwxFieldOptions {
  activeConnection: MinimalSatelliteConnection | null | undefined;
  enabled?: boolean;
  verifier: UseSiwxSignInOptions['verifier'];
}

/**
 * React hook that monitors a Satellite connection and automatically triggers a SIWX sign-in prompt.
 * Implements a `lastPromptedAddress` lock to prevent infinite prompt loops if the user rejects the signature.
 */
export function useSatelliteSiwxAutoAuth(options: UseSatelliteSiwxAutoAuthOptions) {
  const { activeConnection, enabled = true, verifier } = options;
  const { signIn } = useSiwx();
  const { isAuthenticated, session, status } = useSiwxSession();

  const lastPromptedAddress = useRef<string | null>(null);

  useEffect(() => {
    if (!enabled || !activeConnection?.isConnected || !activeConnection?.address || !activeConnection?.chainId) {
      return;
    }

    // Do not trigger prompt if SIWX is currently busy
    if (status === 'building' || status === 'signing' || status === 'verifying') {
      return;
    }

    try {
      const fields = getSatelliteSiwxFields(activeConnection, options);

      // Check if we are already fully authenticated for this exact CAIP-10 address
      if (isAuthenticated && session?.address === fields.address) {
        return;
      }

      // Check if we already prompted for this exact address in this connection lifecycle
      if (lastPromptedAddress.current === fields.address) {
        return;
      }

      // Lock the prompt for this address to avoid retry loops on rejection
      lastPromptedAddress.current = fields.address;

      const triggerAuth = async () => {
        try {
          const signer = await createSatelliteSiwxSigner(activeConnection);
          await signIn({
            signer,
            verifier,
            fields,
          });
        } catch (err) {
          console.error('[SIWX-REACT] Auto-auth initialization failed:', err);
        }
      };

      triggerAuth();
    } catch (error) {
      console.warn('[SIWX-REACT] Auto-auth failed to parse connection fields:', error);
    }
  }, [
    activeConnection?.isConnected,
    activeConnection?.address,
    activeConnection?.chainId,
    enabled,
    isAuthenticated,
    session?.address,
    status,
    verifier,
    // options object itself is not in dependency array to avoid infinite renders if passed inline
    options.domain,
    options.uri,
    options.statement,
  ]);
}
