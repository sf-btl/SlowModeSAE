const nextJest = require('next/jest')

const createJestConfig = nextJest({
  dir: './',
})

const customJestConfig = {
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  testEnvironment: 'jest-environment-jsdom',
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
  },
  testMatch: [
    '**/__tests__/**/*.[jt]s?(x)',
  ],
  testPathIgnorePatterns: ['/node_modules/', '/e2e/', '/.next/'],
  modulePathIgnorePatterns: ['<rootDir>/e2e'],
  transformIgnorePatterns: [
    '/node_modules/(?!(playwright)/)',
  ],
}

module.exports = createJestConfig(customJestConfig)