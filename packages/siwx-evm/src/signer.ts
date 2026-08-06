/**
 * @fileoverview EVM signer adapter for SIWX authentication.
 */

import type { Config } from '@wagmi/core';
import { signMessage } from '@wagmi/core';
import type { WalletClient } from 'viem';

/**
 * Target input for the EVM SIWX signer, accepting either Wagmi or Viem clients.
 */
export type EvmSiwxSignerTarget = Config | WalletClient;

/**
 * Creates a standard SIWX signer callback for EVM chains.
 * Automatically adapts to either a Wagmi Config or a Viem WalletClient.
 *
 * @param target - A Wagmi `Config` instance or a Viem `WalletClient`.
 * @param account - Optional account address to sign with. If omitted, uses the active connector/account.
 * @returns A standardized signer function accepting a message string and returning a promise with the hex signature.
 *
 * @example
 * ```ts
 * const signer = createEvmSiwxSigner(wagmiConfig);
 * const signature = await signer("Mini-Session Login: ...");
 * ```
 */
export function createEvmSiwxSigner(target: EvmSiwxSignerTarget, account?: `0x${string}`) {
  return async (message: string): Promise<string> => {
    // Check if target is a Wagmi Config (it has a state property)
    if ('state' in target && 'connectors' in target) {
      const config = target as Config;
      return await signMessage(config, { message, account });
    }

    // Otherwise, treat it as a Viem WalletClient
    const walletClient = target as WalletClient;

    // Fallback to walletClient.account if explicit account is not provided
    const targetAccount = account ?? walletClient.account;
    if (!targetAccount) {
      throw new Error('[SIWX-EVM] No account provided and WalletClient has no default account.');
    }

    return await walletClient.signMessage({
      message,
      account: targetAccount,
    });
  };
}
