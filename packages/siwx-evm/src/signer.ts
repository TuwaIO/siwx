/**
 * @file EVM signer adapter for SIWX authentication.
 */

import type { Config } from '@wagmi/core';
import { signMessage } from '@wagmi/core';
import type { WalletClient } from 'viem';

/**
 * What {@link createEvmSiwxSigner} can sign with: a wagmi `Config` or a viem `WalletClient`.
 */
export type EvmSiwxSignerTarget = Config | WalletClient;

/**
 * Creates a SIWX signer for EVM wallets: a function that signs a message with EIP-191 `personal_sign` and returns
 * the hex signature. Pass it as `signer` to `useSiwx().signIn` from `@tuwaio/siwx-react`.
 *
 * A wagmi `Config` (detected by its `state` and `connectors` properties) is signed with `signMessage` from
 * `@wagmi/core`; anything else is treated as a viem `WalletClient`.
 *
 * @param target - A wagmi `Config` or a viem `WalletClient`.
 * @param account - Account to sign with. Defaults to the active wagmi account, or to the `WalletClient` account.
 * @returns An async signer. Calling it opens the wallet signature prompt; it rejects with an `Error` whose message
 * starts with `[SIWX-EVM] Signing failed:` (original error in `cause`) when signing fails or no account is
 * available.
 *
 * @example
 * ```ts
 * const signer = createEvmSiwxSigner(wagmiConfig);
 * const signature = await signer(message);
 * ```
 */
export function createEvmSiwxSigner(target: EvmSiwxSignerTarget, account?: `0x${string}`) {
  return async (message: string): Promise<string> => {
    try {
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
    } catch (err) {
      throw new Error(`[SIWX-EVM] Signing failed: ${(err as Error).message}`, { cause: err });
    }
  };
}
