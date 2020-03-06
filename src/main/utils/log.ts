import { Loggerable } from '../types/logger'
import { Logger } from './logger'

const { name } = require('../../../package.json')

const log: Loggerable = new Logger(name)

export { log }
