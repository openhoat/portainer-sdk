const _ = require('lodash')
const { resolve } = require('path')

const baseDir = resolve(__dirname)

const helper = {
  baseDir,
  jestOpts: name => _.get({ e2e: '--runInBand=true' }, name, ''),
}

module.exports = helper
