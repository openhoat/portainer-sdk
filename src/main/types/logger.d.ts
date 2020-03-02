import { IAppenderConfiguration, IBasicLayoutConfiguration, Logger as TsLogger } from 'ts-log-debug'
import { Initializable } from './initializable'
import { Mapable } from './util'

export interface LoggerConfig {
  appenders?: Mapable<IAppenderConfiguration>
  layout?: IBasicLayoutConfiguration
  level: string
}

export interface Loggerable extends TsLogger, Initializable<LoggerConfig> {
  log(...args: any[]): void
}
