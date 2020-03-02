import { GetCaller } from 'main/types/caller'
import { relative } from 'path'
const stackback = require('stackback')

const getCaller: GetCaller = (baseDir, pos = 0) => {
  const e = new Error()
  const stack = stackback(e)
  const index = Math.min(stack.length - 1, pos + 1)
  const s = stack[index]
  return {
    file: s && relative(baseDir, s.getFileName()),
    line: s && s.getLineNumber(),
  }
}

export { getCaller }
