import { Helperable } from 'main/types/helper'

describe('helper unit tests', () => {
  let helper: Helperable
  beforeAll(() => {
    helper = require('main/utils/helper')
  })
  describe('staticImplements', () => {
    it('should return a function', () => {
      // When
      const result = helper.staticImplements()
      // Then
      expect(typeof result).toEqual('function')
      // @ts-ignore
      result()
    })
  })
})
