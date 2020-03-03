import { CommandSpecFactory } from '../../../types/cli-helper'
import { PortainerApiClientable } from '../../../types/portainer-api-client'
import { __ } from '../../../utils/translate'
import { exitOnReject } from '../../cli-helper'

const dockerStopContainer: CommandSpecFactory = (portainer: PortainerApiClientable) => ({
  params: '<id>',
  description: __('Stop the container'),
  builder: args => {
    args.positional('id', { describe: __('Container id or name') })
    return args
  },
  handler: exitOnReject(async ({ id, host }) => {
    const { body } = await portainer.docker.stopContainer(id, host)
    return body
  }),
})

export = dockerStopContainer
