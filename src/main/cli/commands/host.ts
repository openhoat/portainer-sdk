import { get } from 'lodash'
import { CommandSpecFactory } from '../../types/cli-helper'
import { PortainerApiClientable } from '../../types/portainer-api-client'
import { __ } from '../../utils/translate'
import { saveSettings } from '../settings'

const setHostCommandFactory: CommandSpecFactory = (portainer: PortainerApiClientable) => ({
  description: __('Set default portainer host'),
  handler: async ({ host }) => {
    if (!host) {
      return `current host : ${get(portainer, 'options.host', portainer.options.defaultHost)}.`
    }
    portainer.options.defaultHost = host
    await saveSettings(portainer.options)
    return `host ${host} enabled.`
  },
})

export = setHostCommandFactory
