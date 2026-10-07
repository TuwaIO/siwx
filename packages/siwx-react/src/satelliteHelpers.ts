import { formatCaip10AccountId, parseCaip10AccountId, toCaip2ChainId, toEvmChainId } from '@tuwaio/orbit-core';
import type { SiwxChainId, SiwxMessageFields } from '@tuwaio/siwx-core';

import type { SiwxClientSession } from './sessionStore';

/**
 * Duck-typed subset of an active Satellite Connect connection, so `@tuwaio/siwx-react` does not depend on
 * `@tuwaio/satellite-core`. Only `address`, `chainId`, `signMessage` and `connector` are read by the helpers.
 */
export interface MinimalSatelliteConnection {
  /** Whether the wallet is connected. Not read by the helpers. */
  isConnected?: boolean;
  /** Connected account, as a plain address or a CAIP-10 account ID. */
  address?: string;
  /** Connected chain: an EVM chain ID number, a chain reference or a CAIP-2 ID. */
  chainId?: string | number;
  /** Signs a message with the connected wallet. Returned by {@link createSatelliteSiwxSigner}. */
  signMessage?: (message: string) => Promise<string>;
  /**
   * EVM connector, for example the wagmi `Connector` of an `EVMConnection` from `@tuwaio/satellite-evm`. Only its
   * presence is read: it marks the connection as EVM in {@link getSatelliteSiwxFields}.
   */
  connector?: object;
  /** Connected account object of the wallet library. Not read by the helpers. */
  connectedAccount?: unknown;
  /** Connected wallet object of the wallet library. Not read by the helpers. */
  connectedWallet?: unknown;
}

/**
 * Options of {@link getSatelliteSiwxFields}. The values are copied into the CAIP-122 fields.
 */
export interface SatelliteSiwxFieldOptions {
  /** Message `domain`. Defaults to `window.location.host` (empty string outside the browser). */
  domain?: string;
  /** Message `uri`. Defaults to `window.location.href` (empty string outside the browser). */
  uri?: string;
  /** Human-readable statement shown in the wallet. */
  statement?: string;
  /** Explicit ISO 8601 `expirationTime`. Takes precedence over `expirationSeconds`. */
  expirationTime?: string;
  /**
   * Lifetime of the message, in seconds from now, used when `expirationTime` is omitted.
   * @default 86400 (24 hours)
   */
  expirationSeconds?: number;
  /** ISO 8601 `notBefore`. */
  notBefore?: string;
  /** Message `requestId`. */
  requestId?: string;
  /** Message `resources`. */
  resources?: string[];
}

/**
 * Builds the CAIP-122 `fields` for `useSiwx().signIn` from an active Satellite Connect connection.
 *
 * The connection is treated as EVM when its address starts with `0x` or `eip155:`, its `chainId` is a number or
 * starts with `eip155:`, or it has a `connector`; otherwise it is treated as Solana. The CAIP-2 `chainId` and the
 * CAIP-10 `address` are built with `toCaip2ChainId` and `formatCaip10AccountId` from `@tuwaio/orbit-core`: an EVM
 * chain must be a chain number, and a Solana cluster, given as a moniker (`devnet`, as in a Satellite Connect
 * connection) or a Wallet Standard chain (`solana:devnet`), gets its genesis-hash chain ID
 * (`solana:EtWTRABZaYq6iMfeYKouRu166VU2xqa1`).
 *
 * Reads `window.location` for the default `domain` and `uri`. `nonce`, `issuedAt` and `version` are not included;
 * `useSiwx` fills them in.
 *
 * @param activeConnection - The active connection. Must have `address` and `chainId`.
 * @param options - Values for the other message fields.
 * @returns The message fields: `domain`, `uri`, `statement`, `expirationTime`, `notBefore`, `requestId`,
 * `resources`, `address` and `chainId`.
 * @throws {Error} `[SIWX-REACT] Connection missing address or chainId.` when either value is missing, and an error
 * starting with `[SIWX-REACT]` when the address is not an account of the connection's chain (for example an EVM
 * address on a Solana cluster).
 */
export function getSatelliteSiwxFields(
  activeConnection: MinimalSatelliteConnection,
  options?: SatelliteSiwxFieldOptions,
): Omit<SiwxMessageFields, 'nonce' | 'issuedAt' | 'version'> {
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

  const chainRef = rawChainId.includes(':') ? rawChainId.slice(rawChainId.indexOf(':') + 1) : rawChainId;
  const accountAddr = rawAddress.includes(':') ? parseCaip10AccountId(rawAddress)?.address : rawAddress;

  // EVM chains are chain numbers; Solana clusters get the genesis-hash chain ID of CAIP-30 (`devnet` becomes
  // `solana:EtWTRABZ…`)
  const evmChainId = isEvm ? toEvmChainId(chainRef) : undefined;
  const chainId = isEvm ? evmChainId && toCaip2ChainId(evmChainId) : toCaip2ChainId(`solana:${chainRef}`);
  const caip10Address = chainId && accountAddr ? formatCaip10AccountId(chainId, accountAddr) : undefined;
  if (!chainId || !caip10Address) {
    throw new Error(`[SIWX-REACT] Connection address ${rawAddress} is not an account of chain ${rawChainId}.`);
  }
  const caip2ChainId = chainId as SiwxChainId;

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
    chainId: caip2ChainId,
  };
}

/**
 * Returns the `signMessage` method of an active Satellite Connect connection, to be used as `signer` in
 * `useSiwx().signIn`.
 *
 * @param activeConnection - The active connection.
 * @returns A promise resolving to `activeConnection.signMessage`.
 * @throws {Error} `[SIWX-REACT] Connection missing signMessage capability.` (as a rejected promise) when the
 * connection has no `signMessage`.
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
 * Checks whether a SIWX session was issued for the active Satellite Connect connection, for example to reset the
 * session after the user switches account or chain.
 *
 * The session `chainId` must equal the connection's CAIP-2 chain ID, and the session `address` must equal its
 * CAIP-10 account ID (compared case-insensitively for `eip155` sessions). A Solana session signed with a cluster name
 * (`solana:devnet`) matches a connection to that cluster, whose chain ID is now the genesis-hash one.
 *
 * @param session - The current session, for example `useSiwxSession().session`.
 * @param activeConnection - The active connection.
 * @returns `true` when both match; `false` otherwise, including when either argument or the connection address or
 * chain is missing. Never throws.
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
    const account = parseCaip10AccountId(session.address);
    const connected = parseCaip10AccountId(fields.address);
    if (!account || !connected || account.namespace !== connected.namespace) return false;

    // A Solana session signed with a cluster name (`solana:devnet`) still belongs to the same cluster
    if ((toCaip2ChainId(session.chainId) ?? session.chainId) !== fields.chainId) return false;
    return account.namespace === 'eip155'
      ? account.address.toLowerCase() === connected.address.toLowerCase()
      : account.address === connected.address;
  } catch {
    return false;
  }
}
