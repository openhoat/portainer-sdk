import { ExtendOptions, Options } from 'got'
import { DockerApiClientable } from './docker-api-client'

export interface ResponseWithStatusCode {
  statusCode: number
}

export interface ResponseWithBody {
  body: any
}

export type Response = ResponseWithStatusCode & ResponseWithBody

export interface PortainerApiRequestCallerParams {
  options: Options
  withJwt?: boolean
  host?: string
  jwt?: string
}

export interface PortainerApiRequestCaller {
  request(params: PortainerApiRequestCallerParams): Promise<Response>
}

export interface StaticPortainerApiClientable {
  readonly defaultEndpointId: string
  readonly defaultHost: string
  readonly defaultUserAgent: string
  readonly defaultOptions: ExtendOptions

  new (options?: PortainerOptions): PortainerApiClientable
  buildGotOptions(options: Options, host?: string, jwt?: string): Options
}

export interface PortainerApiClientable extends PortainerApiRequestCaller {
  authChanged: boolean
  docker: DockerApiClientable
  options: PortainerOptions
  auth({
    username,
    password,
    host,
  }?: {
    username?: string
    password?: string
    host?: string
  }): Promise<Response & { jwt: string }>
  getHostOptions(host?: string): PortainerHostOptions
  setHostOptions(key: string, value: any, host?: string): void
}

export interface PortainerOptions {
  defaultHost: string
  jwt?: string
  hosts?: PortainerHostsOptions
  saveSettings: boolean
}

export interface PortainerHostsOptions {
  [k: string]: PortainerHostOptions
}

export interface PortainerHostOptions {
  defaultEndpointId?: string
  jwt?: string
  username?: string
  password?: string
}
