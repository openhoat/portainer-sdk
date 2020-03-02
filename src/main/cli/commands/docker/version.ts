import { CommandSpecFactory } from '../../../types/cli-helper'
import { PortainerApiClientable } from '../../../types/portainer-api-client'
import { __ } from '../../../utils/translate'
import { exitOnReject } from '../../cli-helper'

const dockerVersionCommandFactory: CommandSpecFactory = (portainer: PortainerApiClientable) => ({
  description: __('Get docker version'),
  handler: exitOnReject(async ({ host }) => {
    const { body } = await portainer.docker.version(host)
    return body
  }),
})

export = dockerVersionCommandFactory
