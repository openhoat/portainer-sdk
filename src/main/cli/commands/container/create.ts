import { CommandSpecFactory } from '../../../types/cli-helper'
import { PortainerApiClientable } from '../../../types/portainer-api-client'
import { __ } from '../../../utils/translate'

const dockerCreateImage: CommandSpecFactory = (portainer: PortainerApiClientable) => ({
  params: '<image>',
  description: __('Create a container'),
  builder: args => {
    args.positional('image', { describe: __('Container image') })
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
      name: {
        type: 'string',
        description: __('Container name'),
      },
    })
    return args
  },
  handler: async params => portainer.docker.createContainer(params),
})

export = dockerCreateImage
