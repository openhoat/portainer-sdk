import { compact, last } from 'lodash'
import { CommandSpecFactory } from '../../../types/cli-helper'
import { PortainerApiClientable } from '../../../types/portainer-api-client'
import { __ } from '../../../utils/translate'

const dockerCreateImage: CommandSpecFactory = (portainer: PortainerApiClientable) => ({
  description: __('Create a container image'),
  builder: args => {
    args.options({
      from: {
        alias: 'i',
        type: 'string',
        description: __('Remote image to pull'),
      },
      registryAuth: {
        alias: 'a',
        type: 'string',
        description: __('Docker registry authentication token'),
        default: process.env.PORTAINER_REGISTRY_AUTH,
      },
    })
    return args
  },
  handler: async params => {
    const { body } = await portainer.docker.createImage(params)
    if (body) {
      const lastLine = last(compact(((body as unknown) as string).split(/\r\n|\r|\n/)))
      const { status } = lastLine ? JSON.parse(lastLine) : { status: undefined }
      return status
    }
  },
})

export = dockerCreateImage
