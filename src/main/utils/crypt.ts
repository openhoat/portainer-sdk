import { createCipheriv, createDecipheriv, randomBytes } from 'crypto'
import { Cryptable } from '../types/crypt'

const algorithm = 'aes-256-cbc'
const defaultEncryptionKey = 'ur70xs0s8OlThyTHS1ROQlV1fOdN809w'
const ivLength = 16

const crypt: Cryptable = {
  encrypt: (text: string): string => {
    const iv = randomBytes(ivLength)
    const key = Buffer.from(process.env.ENCRYPTION_KEY || defaultEncryptionKey)
    const cipher = createCipheriv(algorithm, key, iv)
    const encrypted = Buffer.concat([cipher.update(text), cipher.final()])
    return `${iv.toString('hex')}:${encrypted.toString('hex')}`
  },
  decrypt: (encryptedText: string): string => {
    const textParts: string[] = encryptedText.split(':')
    const textFirstPart = textParts && textParts.shift()
    if (!textFirstPart) {
      throw new Error('bad format')
    }
    const iv = Buffer.from(textFirstPart, 'hex')
    const encryptedBuffer = Buffer.from(textParts.join(':'), 'hex')
    const key = Buffer.from(process.env.ENCRYPTION_KEY || defaultEncryptionKey)
    const decipher = createDecipheriv(algorithm, key, iv)
    const decrypted = Buffer.concat([decipher.update(encryptedBuffer), decipher.final()])
    return decrypted.toString()
  },
}

export = crypt
