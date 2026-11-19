import { defineConfig } from 'cf/config';

export default defineConfig({
  accountId: '81b27ab7c6fe3a3b3a0e6d31f7d2a381',
  worker: {
    name: 'runesswap',
    compatibilityDate: '2026-09-07',
    compatibilityFlags: ['nodejs_compat'],
    entrypoint: 'src/server.ts',
    // Matches the live Worker, where both are on.
    workersDev: true,
    previewUrls: true,
    observability: {
      enabled: true,
    },
    domains: ['runesswap.app', 'www.runesswap.app'],
  },
});
