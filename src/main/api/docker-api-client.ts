import { Options } from 'got'
import {
  ApiClientParams,
  DockerApiClientable,
  StaticDockerApiClientable,
} from '../types/docker-api-client'
import { PortainerApiRequestCaller } from '../types/portainer-api-client'
import { staticImplements } from '../utils/helper'
import { PortainerApiClient } from './portainer-api-client'

@staticImplements<StaticDockerApiClientable>()
class DockerApiClient implements DockerApiClientable {
  public static buildDockerApiPath(
    path: string,
    endpointId: string = PortainerApiClient.defaultEndpointId,
  ) {
    return `api/endpoints/${endpointId}/docker/${path}`
  }

  protected readonly _apiCaller: PortainerApiRequestCaller

  public get apiCaller() {
    return this._apiCaller
  }

  constructor(apiCaller: PortainerApiRequestCaller) {
    this._apiCaller = apiCaller
  }

  async container(id: string, host?: string) {
    const options: Options = { url: DockerApiClient.buildDockerApiPath(`containers/${id}/json`) }
    return await this.apiCaller.request({ options, host })
  }

  async containers(host?: string) {
    const options: Options = { url: DockerApiClient.buildDockerApiPath('containers/json') }
    return await this.apiCaller.request({ options, host })
  }

  async createContainer(image: string, { qs, payload, host }: ApiClientParams) {
    const options: Options = {
      method: 'post',
      url: DockerApiClient.buildDockerApiPath('containers/create'),
      searchParams: qs,
      json: { ...payload, Image: image },
    }
    return await this.apiCaller.request({ options, host })
  }

  async createImage({ qs, headers, host }: ApiClientParams) {
    const options: Options = {
      method: 'post',
      url: DockerApiClient.buildDockerApiPath('images/create'),
      responseType: 'text',
      searchParams: qs,
      headers,
    }
    return await this.apiCaller.request({ options, host })
  }

  async images(host?: string) {
    const options: Options = { url: DockerApiClient.buildDockerApiPath('images/json') }
    return await this.apiCaller.request({ options, host })
  }

  async info(host?: string) {
    const options: Options = { url: DockerApiClient.buildDockerApiPath('info') }
    return await this.apiCaller.request({ options, host })
  }

  async removeContainer(id: string, host?: string) {
    const options: Options = {
      method: 'delete',
      url: DockerApiClient.buildDockerApiPath(`containers/${id}`),
    }
    return await this.apiCaller.request({ options, host })
  }

  async removeImage(image: string, host?: string) {
    const options: Options = {
      method: 'delete',
      url: DockerApiClient.buildDockerApiPath(`images/${image}`),
    }
    return await this.apiCaller.request({ options, host })
  }

  async startContainer(id: string, host?: string) {
    const options: Options = {
      method: 'post',
      url: DockerApiClient.buildDockerApiPath(`containers/${id}/start`),
    }
    return await this.apiCaller.request({ options, host })
  }

  async stopContainer(id: string, host?: string) {
    const options: Options = {
      method: 'post',
      url: DockerApiClient.buildDockerApiPath(`containers/${id}/stop`),
    }
    return await this.apiCaller.request({ options, host })
  }

  async version(host?: string) {
    const options: Options = { url: DockerApiClient.buildDockerApiPath('version') }
    return await this.apiCaller.request({ options, host })
  }
}

export { DockerApiClient }
