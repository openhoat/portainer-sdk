import { Options } from 'got'
import { compact } from 'lodash'
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

  async container(params: { id: string; host?: string; jwt?: string }) {
    const options: Options = {
      url: DockerApiClient.buildDockerApiPath(`containers/${params.id}/json`),
    }
    return await this.apiCaller.request({ options, host: params.host, jwt: params.jwt })
  }

  async containers(params: { host?: string; jwt?: string }) {
    const options: Options = { url: DockerApiClient.buildDockerApiPath('containers/json') }
    return await this.apiCaller.request({ options, host: params.host, jwt: params.jwt })
  }

  async createContainer(
    params: {
      image: string
      hostConfig?: any
      labels?: any
      name?: string
      env?: any
    } & ApiClientParams,
  ) {
    const qs = { ...params.query }
    const payload = { ...params.data }
    if (params.name) {
      Object.assign(qs, { name: params.name })
    }
    if (params.env) {
      Object.assign(payload, { Env: params.env })
    }
    if (params.hostConfig) {
      Object.assign(payload, { HostConfig: params.hostConfig })
    }
    if (params.labels) {
      Object.assign(payload, { Labels: params.labels })
    }
    const options: Options = {
      method: 'post',
      url: DockerApiClient.buildDockerApiPath('containers/create'),
      searchParams: qs,
      json: { ...payload, Image: params.image },
    }
    return await this.apiCaller.request({ options, host: params.host, jwt: params.jwt })
  }

  async createImage(
    params: {
      from?: string
      registry?: string
    } & ApiClientParams,
  ) {
    const qs = { ...params.query }
    const headers = { ...params.headers }
    if (params.from) {
      const fromImage = compact(
        (params.registry ? params.registry.split('/') : []).concat(params.from.split('/')),
      ).join('/')
      Object.assign(qs, { fromImage })
    }
    if (params.registry) {
      Object.assign(headers, {
        'X-Registry-Auth': Buffer.from(JSON.stringify({ serveraddress: params.registry })).toString(
          'base64',
        ),
      })
    }
    const options: Options = {
      method: 'post',
      url: DockerApiClient.buildDockerApiPath('images/create'),
      responseType: 'text',
      searchParams: qs,
      headers,
    }
    return await this.apiCaller.request({ options, host: params.host, jwt: params.jwt })
  }

  async deployContainer(
    params: {
      image: string
      name: string
      hostConfig?: any
      labels?: any
      env?: any
      registry?: string
    } & ApiClientParams,
  ) {
    try {
      await this.stopContainer({ ...params, id: params.name })
    } catch (err) {
      if (err.origin?.statusCode !== 404) {
        throw err
      }
    }
    try {
      await this.removeContainer({ ...params, id: params.name })
    } catch (err) {
      if (err.origin?.statusCode !== 404) {
        throw err
      }
    }
    try {
      await this.removeImage({ ...params, image: params.image })
    } catch (err) {
      if (err.origin?.statusCode !== 404) {
        throw err
      }
    }
    await this.createImage({
      ...params,
      from: params.image,
      registry: params.registry,
    })
    const { body } = await this.createContainer(params)
    const containerId = body.Id
    return await this.startContainer({ ...params, id: containerId })
  }

  async images(params: ApiClientParams) {
    const options: Options = { url: DockerApiClient.buildDockerApiPath('images/json') }
    return await this.apiCaller.request({ options, host: params.host, jwt: params.jwt })
  }

  async info(params: ApiClientParams) {
    const options: Options = { url: DockerApiClient.buildDockerApiPath('info') }
    return await this.apiCaller.request({ options, host: params.host, jwt: params.jwt })
  }

  async removeContainer(params: { id: string } & ApiClientParams) {
    const options: Options = {
      method: 'delete',
      url: DockerApiClient.buildDockerApiPath(`containers/${params.id}`),
    }
    return await this.apiCaller.request({ options, host: params.host, jwt: params.jwt })
  }

  async removeImage(params: { image: string } & ApiClientParams) {
    const options: Options = {
      method: 'delete',
      url: DockerApiClient.buildDockerApiPath(`images/${params.image}`),
    }
    return await this.apiCaller.request({ options, host: params.host, jwt: params.jwt })
  }

  async startContainer(params: { id: string } & ApiClientParams) {
    const options: Options = {
      method: 'post',
      url: DockerApiClient.buildDockerApiPath(`containers/${params.id}/start`),
    }
    return await this.apiCaller.request({ options, host: params.host, jwt: params.jwt })
  }

  async stopContainer(params: { id: string } & ApiClientParams) {
    const options: Options = {
      method: 'post',
      url: DockerApiClient.buildDockerApiPath(`containers/${params.id}/stop`),
    }
    return await this.apiCaller.request({ options, host: params.host, jwt: params.jwt })
  }

  async version(params: ApiClientParams) {
    const options: Options = { url: DockerApiClient.buildDockerApiPath('version') }
    return await this.apiCaller.request({ options, host: params.host, jwt: params.jwt })
  }
}

export { DockerApiClient }
