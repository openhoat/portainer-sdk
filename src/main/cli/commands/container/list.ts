import { CommandSpecFactory } from '../../../types/cli-helper'
import { PortainerApiClientable } from '../../../types/portainer-api-client'
import { __ } from '../../../utils/translate'

const dockerContainersList: CommandSpecFactory = (portainer: PortainerApiClientable) => ({
  description: __('List containers'),
  handler: async params => portainer.docker.containers(params),
})

export = dockerContainersList
