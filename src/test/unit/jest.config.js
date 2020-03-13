const { resolve } = require('path')
const jestBackConfig = require('../../../jest.config')

const coverageThresholds = {
  statements: 22,
  branches: 23,
  lines: 22,
  functions: 16,
}

const baseDir = resolve(__dirname, '..', '..', '..')

module.exports = {
  ...jestBackConfig,
  coverageDirectory: `${resolve(baseDir, 'dist')}/coverage/unit`,
  coverageThreshold: { global: coverageThresholds },
  testMatch: [`${resolve(baseDir, 'src')}/test/unit/**/*.test.ts`],
}
