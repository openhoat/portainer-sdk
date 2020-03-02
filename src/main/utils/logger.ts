import { worker } from 'cluster'
import { first, forIn, tail } from 'lodash'
import { resolve } from 'path'
import { IAppenderConfiguration, IBasicLayoutConfiguration, Logger as TsLogger } from 'ts-log-debug'
import { Caller } from '../types/caller'
import { Loggerable, LoggerConfig } from '../types/logger'
import { Mapable } from '../types/util'
import { getCaller } from './caller'

const baseDir = resolve(__dirname, '..', '..', '..')

const { NODE_ENV = 'production' } = process.env

const workerIdLogTag = worker ? `worker#${worker.id}` : 'master'
const tokens = { workerId: () => workerIdLogTag }

let defaultLogLevel: string = 'warn'
let defaultLayout: IBasicLayoutConfiguration | undefined
let defaultAppenders: Mapable<IAppenderConfiguration> | undefined

switch (NODE_ENV) {
  case 'production':
    {
      defaultLayout = {
        pattern: '%d %p %c %x{workerId} %m',
        tokens,
        type: 'pattern',
      }
      defaultAppenders = {
        errlog: {
          layout: defaultLayout,
          levels: ['error', 'fatal', 'warn'],
          type: 'stderr',
        },
        stdlog: {
          layout: defaultLayout,
          levels: ['debug', 'info', 'trace'],
          type: 'stdout',
        },
      }
    }
    break
  case 'test':
    {
      defaultAppenders = { 'console-log': { type: 'console' } }
    }
    break
  case 'development':
  default: {
    defaultLogLevel = 'info'
    defaultAppenders = { 'console-log': { type: 'console' } }
  }
}

const DefaultLoggerConfig: LoggerConfig = {
  appenders: defaultAppenders,
  layout: defaultLayout,
  level: defaultLogLevel,
}

class Logger extends TsLogger implements Loggerable {
  protected readonly _config: LoggerConfig = DefaultLoggerConfig

  constructor(name?: string, opt?: Partial<LoggerConfig>) {
    super(name)
    this.init(opt)
  }

  public get config() {
    return this._config
  }

  public init(opt?: Partial<LoggerConfig>): Logger {
    Object.assign(this._config, opt)
    this.level = process.env.LOG_LEVEL || this._config.level
    if (this._config.appenders) {
      this.appenders.clear()
      forIn(this._config.appenders, (config, name) => {
        this.appenders.set(name, config)
      })
    }
    return this
  }

  public log(...args: any[]) {
    this.info(...args)
  }

  public trace(...data: any[]): Logger {
    if (!this.isLevelEnabled('trace')) {
      return this
    }
    const caller: Caller = getCaller(baseDir)
    return (this as any).write(
      'trace',
      [`${caller.file}:${caller.line} - ${first(data)}`].concat(tail(data)),
    )
  }
}

export { DefaultLoggerConfig, Logger, tokens, workerIdLogTag }
