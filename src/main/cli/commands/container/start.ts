import { CommandSpecFactory } from '../../../types/cli-helper'
import { PortainerApiClientable } from '../../../types/portainer-api-client'
import { __ } from '../../../utils/translate'

const dockerStartContainer: CommandSpecFactory = (portainer: PortainerApiClientable) => ({
  params: '<id>',
  description: __('Start the container'),
  builder: args => {
    args.positional('id', { type: 'string', description: __('Container id or name') })
    return args
  },
  handler: async params => portainer.docker.startContainer(params),
})

export = dockerStartContainer
