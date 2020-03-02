import { createCipheriv, createDecipheriv, randomBytes } from 'crypto'

const algorithm = 'aes-256-cbc'
const encryptionKey = process.env.ENCRYPTION_KEY || 'ur70xs0s8OlThyTHS1ROQlV1fOdN809w'
const ivLength = 16

const crypt = {
  encrypt: (text: string): string => {
    const iv = randomBytes(ivLength)
    const cipher = createCipheriv(algorithm, Buffer.from(encryptionKey), iv)
    const encrypted = Buffer.concat([cipher.update(text), cipher.final()])
    return `${iv.toString('hex')}:${encrypted.toString('hex')}`
  },
  decrypt: (text: string): string => {
    const textParts: string[] = text.split(':')
    const textFirstPart: string = (textParts && textParts.shift()) || ''
    const iv = Buffer.from(textFirstPart, 'hex')
    const encryptedText = Buffer.from(textParts.join(':'), 'hex')
    const decipher = createDecipheriv(algorithm, Buffer.from(encryptionKey), iv)
    const decrypted = Buffer.concat([decipher.update(encryptedText), decipher.final()])
    return decrypted.toString()
  },
}

export = crypt
