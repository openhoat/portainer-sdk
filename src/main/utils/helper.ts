import { Helperable } from '../types/helper'

const { name, version } = require('../../../package.json')

const helper: Helperable = {
  name,
  // noinspection JSUnusedLocalSymbols
  staticImplements: <T>() => (__: T) => {
    // @ts-ignore
  },
  version,
}

export = helper
