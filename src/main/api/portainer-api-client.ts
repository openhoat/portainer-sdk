import got, { ExtendOptions, Got, Options } from 'got'
import { get, set } from 'lodash'
import { DockerApiClientable } from 'main/types/docker-api-client'
import { PortainerError } from '../error/portainer-error'
import {
  PortainerApiClientable,
  PortainerApiRequestCallerParams,
  PortainerHostOptions,
  PortainerOptions,
  Response,
  StaticPortainerApiClientable,
} from '../types/portainer-api-client'
import { staticImplements } from '../utils/helper'
import { log } from '../utils/log'
import { DockerApiClient } from './docker-api-client'

const { name, version } = require('../../../package.json')

@staticImplements<StaticPortainerApiClientable>()
class PortainerApiClient implements PortainerApiClientable {
  public static readonly defaultEndpointId: string = '1'
  public static readonly defaultHost: string = 'http://localhost:9000'
  public static readonly defaultUserAgent: string = `${name} v${version}`
  public static readonly defaultOptions: ExtendOptions = {
    headers: {
      'User-Agent': PortainerApiClient.defaultUserAgent,
    },
    prefixUrl: PortainerApiClient.defaultHost,
    responseType: 'json',
    resolveBodyOnly: false,
    throwHttpErrors: false,
    timeout: 5 * 60 * 1000,
  }

  public static buildGotOptions(options: Options, host?: string, jwt?: string): any {
    const gotOptions: any = { ...options }
    if (host) {
      gotOptions.prefixUrl = host
    }
    if (jwt) {
      set(gotOptions, 'headers.Authorization', `Bearer ${jwt}`)
    }
    return gotOptions
  }

  public authChanged: boolean = false

  protected readonly _got: Got
  protected readonly _options: PortainerOptions = {
    defaultHost: PortainerApiClient.defaultHost,
  }
  protected readonly _docker: DockerApiClientable

  public get docker() {
    return this._docker
  }

  public get options() {
    return this._options
  }

  constructor(portainerOptions?: PortainerOptions) {
    if (portainerOptions) {
      this._options = portainerOptions
    }
    this._got = got.extend(PortainerApiClient.defaultOptions)
    this._docker = new DockerApiClient(this)
  }

  async auth(params: { username?: string; password?: string; host?: string }) {
    const { host } = params
    const hostOptions = this.getHostOptions(host)
    const username = params.username || hostOptions.username
    const password = params.password || hostOptions.password
    const options: Options = {
      method: 'post',
      url: 'api/auth',
      json: {
        username,
        password,
      },
    }
    const { statusCode, body } = await this.request({ options, host, withJwt: false })
    const { jwt } = body
    this.setHostOptions('jwt', jwt, host)
    this.setHostOptions('username', username, host)
    this.setHostOptions('password', password, host)
    return { statusCode, body, jwt }
  }

  getHostOptions(host: string = this.options.defaultHost): PortainerHostOptions {
    return get(this.options, ['hosts', host], {})
  }

  async request(params: PortainerApiRequestCallerParams): Promise<Response> {
    const { options, withJwt = true, host = this.options.defaultHost } = params
    this.authChanged = false
    const hostOptions = this.getHostOptions(host)
    const getResponse = async () => {
      const gotOptions = PortainerApiClient.buildGotOptions(
        options,
        host,
        withJwt ? hostOptions.jwt : undefined,
      )
      if (log.isLevelEnabled('debug')) {
        log.debug('got options :', JSON.stringify(gotOptions, null, 2))
      }
      const response = (await this._got(gotOptions)) as any
      log.debug('response status code :', response.statusCode)
      log.debug('response body :', response.body)
      return response
    }
    {
      let response = await getResponse()
      if (response.statusCode === 401 && withJwt) {
        await this.auth({ host })
        this.authChanged = true
        response = await getResponse()
      }
      if (
        response.statusCode !== 200 &&
        response.statusCode !== 204 &&
        response.statusCode !== 304
      ) {
        throw new PortainerError(
          response.body?.details || response.body?.message || response.body,
          {
            statusCode: response.statusCode,
          },
        )
      }
      return response
    }
  }

  setHostOptions(key: string, value: any, host: string = this.options.defaultHost) {
    set(this.options, ['hosts', host, key], value)
  }
}

export { PortainerApiClient }
