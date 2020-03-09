import { promises, readFileSync } from 'fs'
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
const settingsFile = join(userDir, '.portainer-cli.json')

const settings: Settingsable = {
  loadSettingsSync: () => {
    const defaultSettings: PortainerOptions = {
      defaultHost: PortainerApiClient.defaultHost,
      saveSettings: false,
    }
    let savedSettings: Partial<PortainerOptions>
    try {
      savedSettings = { ...JSON.parse(readFileSync(settingsFile, 'utf8')), saveSettings: true }
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
    const { saveSettings, ...optionsToSave } = options
    const savedSettings = { ...optionsToSave, hosts }
    await writeFile(settingsFile, JSON.stringify(savedSettings, null, 2), 'utf8')
  },
}

export = settings
