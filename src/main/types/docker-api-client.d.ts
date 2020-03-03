import { PortainerApiRequestCaller, Response } from './portainer-api-client'

export interface StaticDockerApiClientable {
  buildDockerApiPath(path: string, endpointId?: string): string
}

export interface ApiClientParams {
  payload?: any
  qs?: any
  headers?: any
  host?: string
}

export interface DockerApiClientable {
  readonly apiCaller: PortainerApiRequestCaller
  container(id: string, host?: string): Promise<Response>
  containers(host?: string): Promise<Response>
  createContainer(image: string, params: ApiClientParams): Promise<Response>
  createImage(params: ApiClientParams): Promise<Response>
  images(host?: string): Promise<Response>
  info(host?: string): Promise<Response>
  removeContainer(id: string, host?: string): Promise<Response>
  removeImage(image: string, host?: string): Promise<Response>
  startContainer(id: string, host?: string): Promise<Response>
  stopContainer(id: string, host?: string): Promise<Response>
  version(host?: string): Promise<Response>
}
