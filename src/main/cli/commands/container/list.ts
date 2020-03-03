import { CommandSpecFactory } from '../../../types/cli-helper'
import { PortainerApiClientable } from '../../../types/portainer-api-client'
import { __ } from '../../../utils/translate'
import { exitOnReject } from '../../cli-helper'

const dockerContainersList: CommandSpecFactory = (portainer: PortainerApiClientable) => ({
  description: __('List containers'),
  handler: exitOnReject(async ({ host }) => {
    const { body } = await portainer.docker.containers(host)
    return body
  }),
})

export = dockerContainersList
