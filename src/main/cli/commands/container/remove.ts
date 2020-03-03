import { CommandSpecFactory } from '../../../types/cli-helper'
import { PortainerApiClientable } from '../../../types/portainer-api-client'
import { __ } from '../../../utils/translate'

const dockerRemoveContainer: CommandSpecFactory = (portainer: PortainerApiClientable) => ({
  params: '<id>',
  description: __('Remove the container'),
  builder: args => {
    args.positional('id', { describe: __('Container id or name') })
    return args
  },
  handler: async params => portainer.docker.removeContainer(params),
})

export = dockerRemoveContainer
