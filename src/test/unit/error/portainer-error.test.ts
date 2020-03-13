describe('portainer error unit tests', () => {
  let PortainerError: jest.Mock
  beforeAll(() => {
    PortainerError = require('../../../main/error/portainer-error').PortainerError
  })
  it('should return a PortainerError instance given message and orig params', () => {
    // Given
    const message = 'oops'
    const origin = new Error('oops')
    // When
    const error = new PortainerError(message, origin)
    // Then
    expect(error).toBeTruthy()
    expect(error.origin).toBe(origin)
    expect(error.message).toEqual(message)
  })
  it('should return a PortainerError instance given orig params', () => {
    // Given
    const origin = new Error('oops')
    // When
    const error = new PortainerError(origin)
    // Then
    expect(error).toBeTruthy()
    expect(error.origin).toBe(origin)
    expect(error.message).toEqual(origin.message)
  })
})
