import { PortainerApiRequestCaller, Response } from './portainer-api-client'

export interface StaticDockerApiClientable {
  buildDockerApiPath(path: string, endpointId?: string): string
}

export interface ApiClientParams {
  data?: any
  query?: any
  headers?: any
  host?: string
}

export interface DockerApiClientable {
  readonly apiCaller: PortainerApiRequestCaller
  container(params: { id: string; host?: string }): Promise<Response>
  containers(params: { host?: string }): Promise<Response>
  createContainer(
    params: {
      image: string
      hostConfig?: any
      labels?: any
      name?: string
      env?: any
    } & ApiClientParams,
  ): Promise<Response>
  createImage(params: { from: string; registryAuth?: string } & ApiClientParams): Promise<Response>
  deployContainer(
    params: {
      image: string
      name: string
      hostConfig?: any
      labels?: any
      env?: any
    } & ApiClientParams,
  )
  images(params: ApiClientParams): Promise<Response>
  info(params: ApiClientParams): Promise<Response>
  removeContainer(params: { id: string } & ApiClientParams): Promise<Response>
  removeImage(params: { image: string } & ApiClientParams): Promise<Response>
  startContainer(params: { id: string } & ApiClientParams): Promise<Response>
  stopContainer(params: { id: string } & ApiClientParams): Promise<Response>
  version(params: ApiClientParams): Promise<Response>
}
