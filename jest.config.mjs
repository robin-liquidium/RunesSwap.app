import nextJest from 'next/jest.js';

const createJestConfig = nextJest({
  // Provide the path to your Next.js app to load next.config.js and .env files in your test environment
  dir: './',
});

// Add any custom config to be passed to Jest
/** @type {import('jest').Config} */
const config = {
  coverageProvider: 'v8',
  testEnvironment: 'jsdom',
  // Keep existing module name mapping for path aliases
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
    '^.+\\.module\\.(css|scss)$': '<rootDir>/__mocks__/styleMock.js',
    '^.+\\.(css|scss)$': '<rootDir>/__mocks__/styleMock.js',
    '^@omnisat/lasereyes$': '<rootDir>/__mocks__/lasereyes.ts',
    '^base58-js$': '<rootDir>/node_modules/base58-js/index.js',
  },
  maxWorkers: 1,
  testTimeout: 30000,
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  transformIgnorePatterns: [
    'node_modules/(?!(@omnisat/lasereyes|@omnisat/lasereyes-react|@omnisat/lasereyes-core|bitcoin-address-validation|base58-js)/)',
  ],
};

const buildJestConfig = createJestConfig(config);

// next/jest prepends pnpm-specific ignore patterns that shadow our Bun-compatible
// ESM allowlist. Remove only those generated node_modules patterns after Next has
// assembled the config; the explicit pattern above remains authoritative.
export default async () => {
  const resolvedConfig = await buildJestConfig();
  return {
    ...resolvedConfig,
    transformIgnorePatterns: resolvedConfig.transformIgnorePatterns?.filter(
      (pattern) => !pattern.startsWith('/node_modules'),
    ),
  };
};
