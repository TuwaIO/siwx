const MAINNET = 'solana:5eykt4UsFv8P8NJdTREpY1vzqKqZKvdp';
const DEVNET = 'solana:EtWTRABZaYq6iMfeYKouRu166VU2xqa1';
const TESTNET = 'solana:4uhcVJyU9pJkvQyS88uRDiswHXSCkY3z';

// Other names of the public Solana clusters and their CAIP-2 chain IDs (CAIP-30: the first 32 characters of the base58
// genesis hash). Kept here because siwx-core has no dependencies; the same table is SOLANA_CHAIN_IDS of
// @tuwaio/orbit-core.
const SOLANA_CHAIN_ID_BY_ALIAS: Readonly<Record<string, string>> = {
  'solana:mainnet': MAINNET,
  'solana:mainnet-beta': MAINNET,
  'solana:devnet': DEVNET,
  'solana:testnet': TESTNET,
  // Testnet before its genesis reset, still listed by WalletConnect and Reown
  'solana:4uhcVJyU9pJkvQyS88uRfhDSfZSm8DoR': TESTNET,
};

/**
 * Returns the CAIP-2 chain ID of a public Solana cluster in the form CAIP-30 requires, the genesis hash. Wallet Standard
 * names (`solana:mainnet`, `solana:devnet`, `solana:testnet`), `solana:mainnet-beta` and the testnet ID from before the
 * testnet genesis reset become `solana:5eykt4UsFv8P8NJdTREpY1vzqKqZKvdp`, `solana:EtWTRABZaYq6iMfeYKouRu166VU2xqa1` or
 * `solana:4uhcVJyU9pJkvQyS88uRDiswHXSCkY3z`.
 *
 * Use it to compare Solana chain IDs: sessions signed before the switch to genesis-hash IDs carry `solana:devnet`.
 *
 * @param chainId - A CAIP-2 chain ID.
 * @returns The genesis-hash chain ID for a known Solana cluster name; any other value unchanged (genesis-hash IDs,
 * `solana:localnet`, other namespaces, bare references).
 *
 * @example
 * ```ts
 * normalizeSolanaChainId('solana:devnet'); // "solana:EtWTRABZaYq6iMfeYKouRu166VU2xqa1"
 * normalizeSolanaChainId('eip155:1'); // "eip155:1"
 * ```
 */
export function normalizeSolanaChainId(chainId: string): string {
  return Object.hasOwn(SOLANA_CHAIN_ID_BY_ALIAS, chainId) ? SOLANA_CHAIN_ID_BY_ALIAS[chainId] : chainId;
}

/**
 * Checks a chain ID against the `allowedChainIds` of a verification policy. Chain IDs must match exactly, so `eip155:1`
 * never allows `solana:1` or a bare `1`; the only exception is a Solana cluster, which matches under its name and its
 * genesis-hash chain ID (see {@link normalizeSolanaChainId}).
 *
 * @param chainId - The CAIP-2 chain ID of a message or session.
 * @param allowedChainIds - The allowed CAIP-2 chain IDs. Missing or empty allows every chain.
 * @returns `true` when the chain is allowed.
 *
 * @example
 * ```ts
 * isChainIdAllowed('solana:EtWTRABZaYq6iMfeYKouRu166VU2xqa1', ['solana:devnet']); // true
 * isChainIdAllowed('eip155:1', ['eip155:8453']); // false
 * ```
 */
export function isChainIdAllowed(chainId: string, allowedChainIds?: readonly string[]): boolean {
  if (!allowedChainIds || allowedChainIds.length === 0) return true;
  const normalized = normalizeSolanaChainId(chainId);
  return allowedChainIds.some((allowed) => normalizeSolanaChainId(allowed) === normalized);
}
