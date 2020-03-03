import { CommandSpecFactory } from '../../../types/cli-helper'
import { PortainerApiClientable } from '../../../types/portainer-api-client'
import { __ } from '../../../utils/translate'

const dockerRemoveImage: CommandSpecFactory = (portainer: PortainerApiClientable) => ({
  params: '<image>',
  description: __('Remove an image'),
  builder: args => {
    args.positional('image', { describe: __('Image name') })
    return args
  },
  handler: async params => portainer.docker.removeImage(params),
})

export = dockerRemoveImage
