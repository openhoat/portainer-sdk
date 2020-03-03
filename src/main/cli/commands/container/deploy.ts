import { CommandSpecFactory } from '../../../types/cli-helper'
import { PortainerApiClientable } from '../../../types/portainer-api-client'
import { __ } from '../../../utils/translate'

const dockerStartContainer: CommandSpecFactory = (portainer: PortainerApiClientable) => ({
  params: '<image> <name>',
  description: __(
    'Create and deploy a container (recreate and restart container with a fresh image)',
  ),
  builder: args => {
    args.positional('image', { describe: __('Container image') })
    args.positional('name', { describe: __('Container name') })
    args.options({
      env: {
        type: 'string',
        description: __('JSON env vars'),
        coerce: JSON.parse,
      },
      hostConfig: {
        type: 'string',
        description: __('JSON host config'),
        coerce: JSON.parse,
      },
      labels: {
        type: 'string',
        description: __('JSON labels'),
        coerce: JSON.parse,
      },
    })
    return args
  },
  handler: async params => portainer.docker.deployContainer(params),
})

export = dockerStartContainer
