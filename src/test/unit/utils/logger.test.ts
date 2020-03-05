import { resolve } from 'path'
import { Caller } from '../../../main/types/caller'
import { Loggerable, LoggerConfig } from '../../../main/types/logger'

const baseDir = resolve(__dirname, '../../../..')

describe('logger unit tests', () => {
  let cluster: any
  beforeAll(() => {
    jest.doMock('cluster')
    cluster = require('cluster')
  })
  afterEach(() => {
    jest.resetAllMocks()
  })
  describe('workerIdLogTag', () => {
    it('should return worker id log pattern', () => {
      // Given
      cluster.worker = { id: 'myid' }
      // When
      const { workerIdLogTag } = require('main/utils/logger')
      // Then
      expect(workerIdLogTag).toEqual(`worker#${cluster.worker.id}`)
    })
  })
  describe('tokens', () => {
    it('should return tokens', () => {
      // Given
      cluster.worker = { id: 'myid' }
      // When
      const { tokens } = require('main/utils/logger')
      // Then
      expect(tokens).toBeInstanceOf(Object)
      expect(Object.keys(tokens)).toEqual(['workerId'])
      expect(tokens.workerId).toBeInstanceOf(Function)
      expect(tokens.workerId()).toEqual(`worker#${cluster.worker.id}`)
    })
  })
  describe('DefaultLoggerConfig', () => {
    let nodeEnvOrig
    afterEach(() => {
      jest.resetModules()
    })
    beforeAll(() => {
      jest.resetModules()
      nodeEnvOrig = process.env.NODE_ENV
    })
    afterAll(() => {
      process.env.NODE_ENV = nodeEnvOrig
    })
    it('should provide default logger config given no NODE_ENV', () => {
      // Given
      delete process.env.NODE_ENV
      // When
      const loggerModule = require('main/utils/logger')
      // Then
      expect(loggerModule).toHaveProperty('DefaultLoggerConfig')
      expect(loggerModule.DefaultLoggerConfig).toHaveProperty('appenders')
    })
    it('should provide test logger config given NODE_ENV = "test"', () => {
      // Given
      process.env.NODE_ENV = 'test'
      // When
      const loggerModule = require('main/utils/logger')
      // Then
      expect(loggerModule).toHaveProperty('DefaultLoggerConfig')
      expect(loggerModule.DefaultLoggerConfig).toEqual({
        appenders: { 'console-log': { type: 'console' } },
        layout: undefined,
        level: 'warn',
      })
    })
    it('should provide test logger config given NODE_ENV = "development"', () => {
      // Given
      process.env.NODE_ENV = 'development'
      // When
      const loggerModule = require('main/utils/logger')
      // Then
      expect(loggerModule).toHaveProperty('DefaultLoggerConfig')
      expect(loggerModule.DefaultLoggerConfig).toEqual({
        appenders: { 'console-log': { type: 'console' } },
        layout: undefined,
        level: 'info',
      })
    })
  })
  describe('Logger', () => {
    let TsLogger
    let getCaller
    let Logger
    beforeAll(() => {
      jest.doMock('ts-log-debug')
      TsLogger = require('ts-log-debug').Logger
      jest.doMock('../../../main/utils/caller')
      getCaller = require('../../../main/utils/caller').getCaller
      Logger = require('../../../main/utils/logger').Logger
    })
    describe('constructor', () => {
      let spyInit
      beforeEach(() => {
        spyInit = jest.spyOn(Logger.prototype, 'init').mockImplementation()
      })
      afterEach(() => {
        spyInit.mockRestore()
      })
      it('should return a default instance', () => {
        // When
        const log = new Logger()
        // Then
        expect(log).toBeTruthy()
        expect(TsLogger).toHaveBeenCalled()
        expect(spyInit).toHaveBeenCalled()
      })
      it('should return an instance given name and options', () => {
        // Given
        const name = 'name'
        const opt = { foo: 'bar' }
        // When
        const log = new Logger(name, opt)
        // Then
        expect(log).toBeTruthy()
        expect(TsLogger).toHaveBeenCalledWith(name)
        expect(spyInit).toHaveBeenCalledWith(opt)
      })
    })
    describe('instance', () => {
      let log: Loggerable
      beforeAll(() => {
        const spyInit = jest.spyOn(Logger.prototype, 'init').mockImplementation()
        log = new Logger()
        spyInit.mockRestore()
        ;(log as any).appenders = {
          clear: jest.fn(),
          set: jest.fn(),
        }
      })
      describe('config', () => {
        it('should be ok', () => {
          expect(log.config).toBeTruthy()
        })
      })
      describe('init', () => {
        it('should init logger given default config', () => {
          // Given
          const opt: Partial<LoggerConfig> = { level: 'warn' }
          // When
          const result = log.init(opt)
          // Then
          expect(result).toBe(log)
          expect(log.level).toEqual('warn')
          expect(log.appenders.clear).toHaveBeenCalled()
          expect(log.appenders.set).toHaveBeenCalledTimes(2)
          expect(log.appenders.set).toHaveBeenCalledWith('errlog', expect.anything())
          expect(log.appenders.set).toHaveBeenCalledWith('stdlog', expect.anything())
        })
        it('should init logger given config without appenders', () => {
          // Given
          const opt: Partial<LoggerConfig> = { appenders: undefined }
          // When
          const result = log.init(opt)
          // Then
          expect(result).toBe(log)
          expect(log.level).toEqual('warn')
          expect(log.appenders.clear).not.toHaveBeenCalled()
          expect(log.appenders.set).not.toHaveBeenCalled()
        })
      })
      describe('log', () => {
        let spyInfo: jest.SpyInstance
        beforeAll(() => {
          spyInfo = jest.spyOn(Logger.prototype, 'info').mockImplementation()
        })
        afterAll(() => {
          spyInfo.mockRestore()
        })
        it('should call info method', () => {
          // Given
          const args = ['foo', 'bar']
          // When
          log.log(...args)
          // Then
          expect(spyInfo).toHaveBeenCalledWith(...args)
        })
      })
      describe('trace', () => {
        let spyIsLevelEnabled
        beforeAll(() => {
          spyIsLevelEnabled = jest.spyOn(log, 'isLevelEnabled')
        })
        afterAll(() => {
          spyIsLevelEnabled.mockRestore()
        })
        it('should log trace with caller infos', () => {
          // Given
          const data = 'message'
          const caller: Caller = {
            file: 'sourcefile',
            line: 4,
          }
          spyIsLevelEnabled.mockImplementation(() => true)
          getCaller.mockReturnValue(caller)
          TsLogger.prototype.write.mockReturnValue(log)
          // When
          const result = log.trace(data)
          // Then
          expect(result).toBe(log)
          expect(spyIsLevelEnabled).toHaveBeenCalledWith('trace')
          expect(getCaller).toHaveBeenCalledWith(baseDir)
          expect(TsLogger.prototype.write).toHaveBeenCalledWith('trace', ['sourcefile:4 - message'])
        })
        it('should not log given trace level is disable', () => {
          // Given
          spyIsLevelEnabled.mockImplementation(() => false)
          const data = 'message'
          // When
          const result = log.trace(data)
          // Then
          expect(result).toBe(log)
          expect(spyIsLevelEnabled).toHaveBeenCalledWith('trace')
          expect(getCaller).not.toHaveBeenCalled()
          expect(TsLogger.prototype.write).not.toHaveBeenCalled()
        })
      })
    })
  })
})
