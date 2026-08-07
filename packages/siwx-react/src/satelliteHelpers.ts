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
