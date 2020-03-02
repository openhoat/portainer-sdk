import { promises, readFileSync } from 'fs'
import { safeDump, safeLoad } from 'js-yaml'
import { get, identity, pickBy } from 'lodash'
import { Settingsable } from 'main/types/settingsable'
import { userInfo } from 'os'
import { join } from 'path'
import { PortainerApiClient } from '../api/portainer-api-client'
import { PortainerHostsOptions, PortainerOptions } from '../types/portainer-api-client'
import { decrypt, encrypt } from '../utils/crypt'
import { log } from '../utils/log'

const { writeFile } = promises

const userDir = userInfo().homedir
const settingsFile = join(userDir, '.portainer-cli.yml')

const settings: Settingsable = {
  loadSettingsSync: () => {
    const defaultSettings: PortainerOptions = {
      defaultHost: PortainerApiClient.defaultHost,
    }
    let savedSettings: Partial<PortainerOptions>
    try {
      savedSettings = safeLoad(readFileSync(settingsFile, 'utf8'))
    } catch {
      log.debug('no settings saved : ignore')
      savedSettings = {}
    }
    const hosts = Object.keys(get(savedSettings, 'hosts', {})).reduce((acc, host) => {
      const { defaultEndpointId, jwt, username, password } = get(savedSettings, ['hosts', host], {})
      const decryptedPassword = password && decrypt(password)
      return {
        ...acc,
        [host]: {
          defaultEndpointId,
          jwt,
          username,
          password: decryptedPassword,
        },
      }
    }, {} as PortainerHostsOptions)
    return {
      ...defaultSettings,
      ...savedSettings,
      hosts,
    }
  },
  saveSettings: async (options: PortainerOptions) => {
    const hosts = Object.keys(get(options, 'hosts', {})).reduce((acc, host) => {
      const { defaultEndpointId, jwt, username, password } = get(options, ['hosts', host], {})
      const cryptedPassword = password && encrypt(password)
      const hostSettings = pickBy(
        {
          defaultEndpointId,
          jwt,
          username,
          password: cryptedPassword,
        },
        identity,
      )
      return {
        ...acc,
        [host]: hostSettings,
      }
    }, {} as PortainerHostsOptions)
    const savedSettings = { ...options, hosts }
    await writeFile(settingsFile, safeDump(savedSettings, { lineWidth: 132 }), 'utf8')
  },
}

export = settings
