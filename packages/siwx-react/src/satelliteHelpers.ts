import type { SiwxClientSession } from './sessionStore';

/**
 * Duck-typed interface for a Satellite Connection to avoid strict dependency on `@tuwaio/satellite-core`.
 */
export interface MinimalSatelliteConnection {
  isConnected?: boolean;
  address?: string;
  chainId?: string | number;
  signMessage?: (message: string) => Promise<string>;
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
  expirationTime?: string;
  expirationSeconds?: number;
  notBefore?: string;
  requestId?: string;
  resources?: string[];
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

  const rawAddress = String(activeConnection.address);
  const rawChainId = String(activeConnection.chainId);

  const isEvm =
    rawAddress.startsWith('0x') ||
    rawAddress.startsWith('eip155:') ||
    typeof activeConnection.chainId === 'number' ||
    rawChainId.startsWith('eip155:') ||
    !!activeConnection.connector;

  const chainRef = rawChainId.includes(':') ? rawChainId.split(':').slice(1).join(':') : rawChainId;
  const accountAddr = rawAddress.includes(':') ? rawAddress.split(':').pop()! : rawAddress;

  const caip2ChainId = isEvm ? `eip155:${chainRef}` : `solana:${chainRef}`;
  const caip10Address = `${caip2ChainId}:${accountAddr}`;

  const now = Date.now();
  const expirationTime =
    options?.expirationTime ??
    (options?.expirationSeconds !== undefined
      ? new Date(now + options.expirationSeconds * 1000).toISOString()
      : new Date(now + 24 * 60 * 60 * 1000).toISOString());

  return {
    domain: options?.domain ?? (typeof window !== 'undefined' ? window.location.host : ''),
    uri: options?.uri ?? (typeof window !== 'undefined' ? window.location.href : ''),
    statement: options?.statement,
    expirationTime,
    notBefore: options?.notBefore,
    requestId: options?.requestId,
    resources: options?.resources,
    address: caip10Address,
    chainId: caip2ChainId as never,
  };
}

/**
 * Accepts a Satellite connection and returns its native signing method.
 */
export async function createSatelliteSiwxSigner(
  activeConnection: MinimalSatelliteConnection,
): Promise<(message: string) => Promise<string>> {
  if (!activeConnection.signMessage) {
    throw new Error('[SIWX-REACT] Connection missing signMessage capability.');
  }

  return activeConnection.signMessage;
}

/**
 * Evaluates whether an active SIWX session matches an active Satellite connection.
 */
export function isSessionMatchingConnection(
  session: SiwxClientSession | null,
  activeConnection: MinimalSatelliteConnection | null | undefined,
): boolean {
  if (!session || !activeConnection?.address || !activeConnection?.chainId) {
    return false;
  }

  try {
    const fields = getSatelliteSiwxFields(activeConnection);
    const sessionAddr = session.address;
    const activeAddr = fields.address;

    if (session.chainId !== fields.chainId) {
      return false;
    }

    if (sessionAddr.startsWith('eip155:')) {
      return sessionAddr.toLowerCase() === activeAddr.toLowerCase();
    }

    return sessionAddr === activeAddr;
  } catch {
    return false;
  }
}
