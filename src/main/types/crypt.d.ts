export interface Cryptable {
  encrypt: (text: string) => string
  decrypt: (encryptedText: string) => string
}
