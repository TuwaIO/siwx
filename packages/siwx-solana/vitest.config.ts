import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    name: 'siwx-solana',
    // 'happy-dom' or 'node' — SubtleCrypto is available in both Node 20+ and happy-dom
    environment: 'node',
    include: ['src/**/__tests__/**/*.test.ts'],
    coverage: {
      provider: 'v8',
      include: ['src/**/*.ts'],
      exclude: ['src/**/__tests__/**', 'src/**/index.ts'],
    },
  },
});
