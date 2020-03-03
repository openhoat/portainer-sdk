import { exit, stderr } from 'process'
import * as yargs from 'yargs'
import { PortainerApiClient } from '../api/portainer-api-client'
import { __ } from '../utils/translate'
import { finishCommandFactory, loadCommands } from './cli-helper'
import { loadSettingsSync } from './settings'

const cli = () => {
  const name = 'portainer'
  const usage = 'Usage: $0 <command> [options]'
  const settings = loadSettingsSync()
  const portainer = new PortainerApiClient(settings)
  const options: { [key: string]: yargs.Options } = {
    host: {
      alias: 'h',
      type: 'string',
      description: __('Portainer host to connect to'),
    },
    query: {
      alias: 'q',
      type: 'string',
      description: __('Querystring params'),
      coerce: JSON.parse,
    },
    data: {
      alias: 'd',
      type: 'string',
      description: __('Payload json attributes'),
      coerce: JSON.parse,
    },
    headers: {
      alias: 'H',
      type: 'string',
      description: __('Request headers'),
      coerce: JSON.parse,
    },
    yaml: {
      alias: 'y',
      type: 'boolean',
      description: __('YAML format output'),
    },
  }
  try {
    // tslint:disable-next-line:no-unused-expression
    loadCommands(portainer)
      .reduce((acc, command) => acc.command(command), yargs)
      .usage(usage)
      .scriptName(name)
      .wrap(132)
      .options(options)
      .demandCommand()
      .onFinishCommand(finishCommandFactory(portainer))
      .help()
      .strict().argv
  } catch (err) {
    stderr.write(err.stack)
    stderr.write('\n')
    exit(1)
  }
}

cli()
