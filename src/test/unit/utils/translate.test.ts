import { when } from 'jest-when'
import { pick } from 'lodash'

describe('translate', () => {
  let origEnv
  let y18n: jest.Mock
  let y18nTranslate: jest.Mock
  beforeAll(() => {
    jest.doMock('y18n')
    y18nTranslate = jest.fn()
  })
  beforeEach(() => {
    origEnv = pick(process.env, ['LC_ALL', 'LC_MESSAGES', 'LANG', 'LANGUAGE'])
    delete process.env.LC_ALL
    delete process.env.LC_MESSAGES
    delete process.env.LANG
    delete process.env.LANGUAGE
    y18n = require('y18n')
  })
  afterEach(() => {
    Object.assign(process.env, origEnv)
    jest.resetAllMocks()
    jest.resetModules()
  })
  describe('__', () => {
    it('should translate given text', () => {
      // Given
      when(y18n)
        .calledWith({ locale: undefined, updateFiles: false })
        .mockReturnValue({ __: y18nTranslate })
      const { __ } = require('../../../main/utils/translate')
      const text = 'hello'
      const expectedResult = 'foo'
      y18nTranslate.mockReturnValue(expectedResult)
      // When
      const result = __(text)
      // Then
      expect(result).toEqual(expectedResult)
    })
    it('should translate given text and LANGUAGE env var', () => {
      // Given
      process.env.LANGUAGE = 'fr'
      when(y18n)
        .calledWith({ locale: process.env.LANGUAGE, updateFiles: false })
        .mockReturnValue({ __: y18nTranslate })
      const { __ } = require('../../../main/utils/translate')
      const text = 'hello'
      const expectedResult = 'foo'
      y18nTranslate.mockReturnValue(expectedResult)
      // When
      const result = __(text)
      // Then
      expect(result).toEqual(expectedResult)
    })
  })
})
