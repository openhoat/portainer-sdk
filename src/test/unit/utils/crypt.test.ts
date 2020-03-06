import * as crypto from 'crypto'
import { when } from 'jest-when'
import { decrypt, encrypt } from '../../../main/utils/crypt'
import { expectFnToThrow } from '../../jest-helper'

describe('crypt unit tests', () => {
  const iv = Buffer.from('71898a4d9c19e8a2a7b112ec1efc0439', 'hex')
  const usecases: [string, string][] = [
    ['hello', '1b97f3a02ee312e5063e1f3904b33ba3'],
    ['foo', '41412260fae3b9c465bff7901373ac78'],
    ['bar', 'af5a105878148185f843219f329d76a2'],
  ]
  let randomBytes
  let origEncryptionEnv: string | undefined
  const ivLength = 16
  beforeAll(() => {
    randomBytes = jest.spyOn(crypto, 'randomBytes')
  })
  beforeEach(() => {
    origEncryptionEnv = process.env.ENCRYPTION_KEY
    delete process.env.ENCRYPTION_KEY
  })
  afterEach(() => {
    process.env.ENCRYPTION_KEY = origEncryptionEnv
  })
  describe('encrypt', () => {
    it.each(usecases)(
      'should encrypt given text %s and return %s',
      (text: string, encryptedText: string) => {
        // Given
        when(randomBytes)
          .calledWith(ivLength)
          .mockReturnValue(iv)
        // When
        const result = encrypt(text)
        // Then
        expect(result).toBe(`${iv.toString('hex')}:${encryptedText}`)
      },
    )
  })
  describe('decrypt', () => {
    it.each(usecases)(
      'should decrypt given text %s and return %s',
      (text: string, encryptedText: string) => {
        // When
        const result = decrypt(`${iv.toString('hex')}:${encryptedText}`)
        // Then
        expect(result).toBe(text)
      },
    )
    it('should throw an error given bad encrypted text', () => {
      // Given
      const expectedError = new Error('bad format')
      // When
      const fn = () => decrypt('')
      // Then
      expectFnToThrow(fn, expectedError)
    })
  })
})
