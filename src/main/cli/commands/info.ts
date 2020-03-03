import { CommandSpecFactory } from '../../types/cli-helper'
import { PortainerApiClientable } from '../../types/portainer-api-client'
import { __ } from '../../utils/translate'

const dockerInfoCommandFactory: CommandSpecFactory = (portainer: PortainerApiClientable) => ({
  description: __('Get docker infos'),
  handler: async params => portainer.docker.info(params),
})

export = dockerInfoCommandFactory
