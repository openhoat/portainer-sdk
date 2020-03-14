import { Got, Options } from 'got'
import { when } from 'jest-when'
import { noop } from 'lodash'
import {
  PortainerApiClientable,
  PortainerHostOptions,
  PortainerOptions,
  StaticPortainerApiClientable,
} from '../../../main/types/portainer-api-client'

describe('portainer api client unit tests', () => {
  let got: jest.Mocked<Got>
  let PortainerApiClient: StaticPortainerApiClientable
  let DockerApiClient: jest.Mock
  let spyDockerApiClientConstructor: jest.SpyInstance
  beforeAll(() => {
    jest.doMock('got')
    got = require('got').default
    jest.doMock('../../../main/utils/log')
    jest.doMock('../../../main/api/docker-api-client')
    ;({ DockerApiClient } = require('../../../main/api/docker-api-client'))
    spyDockerApiClientConstructor = jest.spyOn(DockerApiClient.prototype, 'constructor')
    jest.doMock('../../../../package.json')
    ;({ PortainerApiClient } = require('../../../main/api/portainer-api-client'))
  })
  afterAll(() => {
    jest.restoreAllMocks()
  })
  afterEach(() => {
    jest.resetAllMocks()
  })
  describe('buildGotOptions', () => {
    it('should return built got options', () => {
      // Given
      const options: Options = {
        responseType: 'json',
        method: 'get',
      }
      // When
      const result = PortainerApiClient.buildGotOptions(options)
      // Then
      expect(result).toEqual(options)
    })
    it('should return built got options given host and jwt', () => {
      // Given
      const options: Options = {
        responseType: 'json',
        method: 'get',
      }
      const host = 'my host'
      const jwt = 'my jwt'
      // When
      const result = PortainerApiClient.buildGotOptions(options, host, jwt)
      // Then
      expect(result).toEqual({
        ...options,
        headers: { Authorization: `Bearer ${jwt}` },
        prefixUrl: host,
      })
    })
  })
  describe('constructor', () => {
    it('should return a PortainerApiClient instance', () => {
      // Given
      const _got = ('my got' as unknown) as Got
      when(got.extend)
        .calledWith(PortainerApiClient.defaultOptions)
        .mockReturnValue(_got)
      const dockerApiClient = new DockerApiClient()
      spyDockerApiClientConstructor.mockImplementation(() => dockerApiClient)
      // When
      const portainer = new PortainerApiClient()
      // Then
      expect(got.extend).toHaveBeenCalledWith(PortainerApiClient.defaultOptions)
      expect(DockerApiClient).toHaveBeenCalledWith(portainer)
      expect(portainer).toBeInstanceOf(PortainerApiClient)
      expect(portainer).toHaveProperty('_options', {
        defaultHost: PortainerApiClient.defaultHost,
        saveSettings: false,
      })
      expect(portainer).toHaveProperty('_got', _got)
      expect(portainer).toHaveProperty('_docker', dockerApiClient)
    })
    it('should return a PortainerApiClient instance given options', () => {
      // Given
      const options: PortainerOptions = {
        saveSettings: false,
        defaultHost: 'my default host',
      }
      const _got = ('my got' as unknown) as Got
      when(got.extend)
        .calledWith(PortainerApiClient.defaultOptions)
        .mockReturnValue(_got)
      const dockerApiClient = new DockerApiClient()
      spyDockerApiClientConstructor.mockImplementation(() => dockerApiClient)
      // When
      const portainer = new PortainerApiClient(options)
      // Then
      expect(got.extend).toHaveBeenCalledWith(PortainerApiClient.defaultOptions)
      expect(DockerApiClient).toHaveBeenCalledWith(portainer)
      expect(portainer).toBeInstanceOf(PortainerApiClient)
      expect(portainer).toHaveProperty('_options', options)
      expect(portainer).toHaveProperty('_got', _got)
      expect(portainer).toHaveProperty('_docker', dockerApiClient)
    })
  })
  describe('instance', () => {
    let portainer: PortainerApiClientable
    beforeAll(() => {
      portainer = new PortainerApiClient()
    })
    describe('auth', () => {
      let getHostOptions: jest.SpyInstance
      let request: jest.SpyInstance
      let setHostOptions: jest.SpyInstance
      beforeAll(() => {
        getHostOptions = jest
          .spyOn(PortainerApiClient.prototype, 'getHostOptions')
          .mockImplementation(noop)
        request = jest
          .spyOn(PortainerApiClient.prototype, 'request')
          .mockImplementation(() => Promise.resolve())
        setHostOptions = jest
          .spyOn(PortainerApiClient.prototype, 'setHostOptions')
          .mockImplementation(noop)
      })
      afterAll(() => {
        getHostOptions.mockRestore()
        request.mockRestore()
        setHostOptions.mockRestore()
      })
      it('should authenticate portainer account', async () => {
        // Given
        const hostOptions: PortainerHostOptions = {
          defaultEndpointId: '2',
        }
        when(getHostOptions)
          .calledWith(undefined)
          .mockReturnValue(hostOptions)
        const options: Options = {
          method: 'post',
          url: 'api/auth',
          json: {
            username: undefined,
            password: undefined,
          },
        }
        const statusCode = 200
        const jwt = 'my jwt'
        const body = { foo: 'bar', jwt }
        when(request)
          .calledWith({ options, host: undefined, withJwt: false })
          .mockResolvedValue({ statusCode, body })
        // When
        const result = await portainer.auth()
        // Then
        expect(getHostOptions).toHaveBeenCalledWith(undefined)
        expect(request).toHaveBeenCalledWith({ options, host: undefined, withJwt: false })
        expect(setHostOptions).toHaveBeenCalledWith('jwt', jwt, undefined)
        expect(result).toEqual({ statusCode, body: { foo: 'bar', jwt }, jwt })
      })
      it('should authenticate portainer account given username, password and host', async () => {
        // Given
        const username = 'my username'
        const password = 'my password'
        const host = 'my host'
        const hostOptions: PortainerHostOptions = {
          defaultEndpointId: '2',
        }
        when(getHostOptions)
          .calledWith(host)
          .mockReturnValue(hostOptions)
        const options: Options = {
          method: 'post',
          url: 'api/auth',
          json: {
            username,
            password,
          },
        }
        const statusCode = 200
        const jwt = 'my jwt'
        const body = { foo: 'bar', jwt }
        when(request)
          .calledWith({ options, host, withJwt: false })
          .mockResolvedValue({ statusCode, body })
        // When
        const result = await portainer.auth({ username, password, host })
        // Then
        expect(getHostOptions).toHaveBeenCalledWith(host)
        expect(request).toHaveBeenCalledWith({ options, host, withJwt: false })
        expect(setHostOptions).toHaveBeenCalledWith('jwt', jwt, host)
        expect(result).toEqual({ statusCode, body: { foo: 'bar', jwt }, jwt })
      })
    })
  })
})
