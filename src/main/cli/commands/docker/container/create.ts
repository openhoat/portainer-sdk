import { CommandSpecFactory } from '../../../../types/cli-helper'
import { PortainerApiClientable } from '../../../../types/portainer-api-client'
import { __ } from '../../../../utils/translate'
import { exitOnReject } from '../../../cli-helper'

const dockerCreateImage: CommandSpecFactory = (portainer: PortainerApiClientable) => ({
  params: '<image>',
  description: __('Create a container'),
  builder: args => {
    args.positional('image', { describe: __('Container image') })
    args.options({
      env: {
        type: 'string',
        description: __('JSON env vars'),
      },
      hostConfig: {
        type: 'string',
        description: __('JSON host config'),
      },
      labels: {
        type: 'string',
        description: __('JSON labels'),
      },
      name: {
        type: 'string',
        description: __('Container name'),
      },
    })
    return args
  },
  handler: exitOnReject(async args => {
    const qs = { ...args.query }
    const payload = { ...args.data }
    if (args.env) {
      Object.assign(payload, { Env: JSON.parse(args.env) })
    }
    if (args.hostConfig) {
      Object.assign(payload, { HostConfig: JSON.parse(args.hostConfig) })
    }
    if (args.labels) {
      Object.assign(payload, { Labels: JSON.parse(args.labels) })
    }
    if (args.name) {
      Object.assign(qs, { name: args.name })
    }
    const { body } = await portainer.docker.createContainer(args.image, {
      qs,
      payload,
      headers: args.headers,
      host: args.host,
    })
    return body
  }),
})

export = dockerCreateImage
