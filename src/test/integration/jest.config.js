const { resolve } = require('path')
const jestBackConfig = require('../../../jest.config')

const coverageThresholds = {
  statements: 0,
  branches: 0,
  lines: 0,
  functions: 0,
}

const baseDir = resolve(__dirname, '..', '..', '..')

module.exports = {
  ...jestBackConfig,
  coverageDirectory: `${resolve(baseDir, 'dist')}/coverage/integration`,
  coverageThreshold: { global: coverageThresholds },
  testMatch: [`${resolve(baseDir, 'src')}/test/integration/**/*.test.ts`],
}
