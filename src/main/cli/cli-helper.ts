import { kebabCase } from 'lodash'
import { extname, relative, resolve, sep } from 'path'
import * as requireDirectory from 'require-directory'
import { CommandModule } from 'yargs'
import { CliHelperable, CommandSpec } from '../types/cli-helper'
import { log } from '../utils/log'
import { saveSettings } from './settings'

const { exit, stderr, stdout } = process

const cliHelper: CliHelperable = {
  exitOnReject: (fn: (argv: any) => Promise<any>) => argv =>
    fn(argv).catch(err => {
      log.debug(err.stack)
      stderr.write(err.toString())
      stderr.write('\n')
      exit(1)
    }),
  finishCommandFactory: (portainer) => async result => {
    if (portainer.authChanged) {
      await saveSettings(portainer.options)
    }
    if (result !== undefined) {
      stdout.write(typeof result === 'object' ? JSON.stringify(result, null, 2) : result)
    }
    stdout.write('\n')
  },
  loadCommands: portainer => {
    const commands: CommandModule[] = []
    const commandRootDir = resolve(__dirname, './commands')
    const visitor = (commandSpecFactory, path) => {
      const { aliases, builder, description, handler, params }: CommandSpec = commandSpecFactory(
        portainer,
      )
      const relativePath = relative(commandRootDir, path)
      const commandName = kebabCase(
        relativePath
          .slice(0, -extname(relativePath).length)
          .split(sep)
          .join(' '),
      )
      commands.push({
        command: params ? `${commandName} ${params}` : commandName,
        aliases,
        builder,
        describe: description,
        handler,
      })
    }
    requireDirectory(module, './commands', {
      extensions: ['js', 'ts'],
      recurse: true,
      exclude: /\.d\.ts$/,
      visit: (visitor as unknown) as (obj: any) => void,
    })
    return commands
  },
}

export = cliHelper
