import { CommandSpecFactory } from '../../types/cli-helper'
import { PortainerApiClientable } from '../../types/portainer-api-client'
import { log } from '../../utils/log'
import { __ } from '../../utils/translate'
import { saveSettings } from '../settings'

const authCommandFactory: CommandSpecFactory = (portainer: PortainerApiClientable) => ({
  params: '[username] [password]',
  description: __('Log in to portainer'),
  builder: args => {
    args.positional('username', {
      type: 'string',
      description: __('Username'),
      default: process.env.PORTAINER_USERNAME,
    })
    args.positional('password', {
      type: 'string',
      description: __('Password'),
      default: process.env.PORTAINER_PASSWORD,
    })
    return args
  },
  handler: async params => {
    await portainer.auth(params)
    log.debug('portainer options :', portainer.options)
    const { jwt } = portainer.getHostOptions(params.host)
    await saveSettings(portainer.options)
    return jwt
  },
})

export = authCommandFactory
