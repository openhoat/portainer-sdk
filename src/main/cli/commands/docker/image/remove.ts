import { CommandSpecFactory } from '../../../../types/cli-helper'
import { PortainerApiClientable } from '../../../../types/portainer-api-client'
import { __ } from '../../../../utils/translate'
import { exitOnReject } from '../../../cli-helper'

const dockerRemoveImage: CommandSpecFactory = (portainer: PortainerApiClientable) => ({
  params: '<image>',
  description: __('Remove an image'),
  builder: args => {
    args.positional('image', { describe: __('Image name') })
    return args
  },
  handler: exitOnReject(async ({ image, host }) => {
    const { body } = await portainer.docker.removeImage(image, host)
    return body
  }),
})

export = dockerRemoveImage
