import { PortainerOptions } from './portainer-api-client'

export interface Settingsable {
  loadSettingsSync(): PortainerOptions
  saveSettings(portainerOptions: PortainerOptions): Promise<void>
}
