import { CommandSpecFactory } from '../../types/cli-helper'
import { PortainerApiClientable } from '../../types/portainer-api-client'
import { __ } from '../../utils/translate'
import { exitOnReject } from '../cli-helper'

const dockerInfoCommandFactory: CommandSpecFactory = (portainer: PortainerApiClientable) => ({
  description: __('Get docker infos'),
  handler: exitOnReject(async ({ host }) => {
    const { body } = await portainer.docker.info(host)
    return body
  }),
})

export = dockerInfoCommandFactory
