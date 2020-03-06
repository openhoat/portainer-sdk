describe('log unit tests', () => {
  const name = 'my name'
  let Logger
  let log
  beforeAll(() => {
    jest.doMock('../../../../package.json', () => ({ name }))
    jest.doMock('../../../main/utils/logger')
    Logger = require('../../../main/utils/logger').Logger
  })
  it('should provide a logger instance based on config module', () => {
    // When
    log = require('../../../main/utils/log').log
    // Then
    expect(log).toBeTruthy()
    expect(Logger).toHaveBeenCalledWith(name)
  })
})
