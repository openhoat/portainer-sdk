import { Helperable } from '../types/helper'

const helper: Helperable = {
  // noinspection JSUnusedLocalSymbols
  staticImplements: <T>() => (__: T) => {
    // @ts-ignore
  },
}

export = helper
