/**
 * Vitest workspace configuration for the @tuwaio/siwx monorepo.
 * Each package has its own vitest config tailored to its environment.
 */
export default [
  'packages/siwx-core/vitest.config.ts',
  'packages/siwx-evm/vitest.config.ts',
  'packages/siwx-solana/vitest.config.ts',
  'packages/siwx-react/vitest.config.ts',
  'packages/siwx-server/vitest.config.ts',
];
