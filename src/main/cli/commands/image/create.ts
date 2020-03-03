import { compact, last } from 'lodash'
import { CommandSpecFactory } from '../../../types/cli-helper'
import { PortainerApiClientable } from '../../../types/portainer-api-client'
import { __ } from '../../../utils/translate'
import { exitOnReject } from '../../cli-helper'

const dockerCreateImage: CommandSpecFactory = (portainer: PortainerApiClientable) => ({
  description: __('Create a container image'),
  builder: args => {
    args.options({
      from: {
        type: 'string',
        description: __('Remote image to pull'),
      },
    })
    return args
  },
  handler: exitOnReject(async args => {
    const qs = { ...args.query }
    if (args.from) {
      Object.assign(qs, { fromImage: args.from })
    }
    const { body } = await portainer.docker.createImage({
      qs,
      headers: args.headers,
      host: args.host,
    })
    if (body) {
      const lastLine = last(compact(((body as unknown) as string).split(/\r\n|\r|\n/)))
      const { status } = lastLine ? JSON.parse(lastLine) : { status: undefined }
      return status
    }
  }),
})

export = dockerCreateImage
