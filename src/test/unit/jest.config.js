const { resolve } = require('path')
const jestBackConfig = require('../../../jest.config')

const coverageThresholds = {
  statements: 33,
  branches: 31,
  lines: 33,
  functions: 20,
}

const baseDir = resolve(__dirname, '..', '..', '..')

module.exports = {
  ...jestBackConfig,
  coverageDirectory: `${resolve(baseDir, 'dist')}/coverage/unit`,
  coverageThreshold: { global: coverageThresholds },
  testMatch: [`${resolve(baseDir, 'src')}/test/unit/**/*.test.ts`],
}
