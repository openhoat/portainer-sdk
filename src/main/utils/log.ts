import { Loggerable } from '../types/logger'
import { name } from './helper'
import { Logger } from './logger'

const log: Loggerable = new Logger(name)

export { log }
