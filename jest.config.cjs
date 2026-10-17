module.exports = {
  preset: 'ts-jest/presets/default-esm',
  testEnvironment: 'node',
  transform: {
    '^.+\\.ts$': [
      'ts-jest',
      {
        tsconfig: 'tsconfig.json',
        useESM: true,
      },
    ],
  },
  moduleFileExtensions: ['ts', 'js', 'json'],
  testMatch: ['**/*.test.ts', '**/*.spec.ts'],
  // Mirrors the "@/*" -> "./src/*" path alias from tsconfig.json - ts-jest
  // only type-checks/transpiles, it doesn't resolve TS path aliases at
  // runtime, so without this any non-type-only "@/..." import fails to
  // resolve in tests.
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
  },
};
