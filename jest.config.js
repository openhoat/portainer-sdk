const { resolve } = require('path')

const coverageThresholds = {
  statements: 20,
  branches: 28,
  lines: 20,
  functions: 13,
}

const baseDir = __dirname

module.exports = {
  clearMocks: true,
  collectCoverageFrom: ['src/main/**/!(*.d)*.ts'],
  coverageDirectory: `${resolve(baseDir, 'dist')}/coverage`,
  coverageReporters: ['json-summary', 'text', 'html', 'lcov'],
  coverageThreshold: { global: coverageThresholds },
  displayName: 'backend',
  globalSetup: `${baseDir}/jest-global.setup.js`,
  moduleNameMapper: {
    '^main/(.*)$': '<rootDir>/src/main/$1',
    '^test/(.*)$': '<rootDir>/src/test/$1',
  },
  preset: 'ts-jest',
  rootDir: baseDir,
  testEnvironment: 'node',
  testMatch: [`${resolve(baseDir, 'src')}/test/{e2e,integration,unit}/**/*.test.ts`],
}
