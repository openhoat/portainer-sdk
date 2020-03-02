import { Arguments, CommandBuilder, CommandModule } from 'yargs'
import { PortainerApiClientable } from './portainer-api-client'

export interface CommandSpec {
  params?: ReadonlyArray<string> | string
  aliases?: ReadonlyArray<string> | string
  builder?: CommandBuilder
  description?: string | false
  handler: (args: Arguments) => void
}

export type CommandSpecFactory = (portainer: PortainerApiClientable) => CommandSpec

export interface CliHelperable {
  exitOnReject(fn: (argv: any) => Promise<any>)
  finishCommandFactory(portainer: PortainerApiClientable): (result: any) => Promise<void>
  loadCommands(portainer: PortainerApiClientable): CommandModule[]
}
