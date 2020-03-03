import { CommandSpecFactory } from '../../types/cli-helper'
import { PortainerApiClientable } from '../../types/portainer-api-client'
import { __ } from '../../utils/translate'

const dockerVersionCommandFactory: CommandSpecFactory = (portainer: PortainerApiClientable) => ({
  description: __('Get docker version'),
  handler: params => portainer.docker.version(params),
})

export = dockerVersionCommandFactory
