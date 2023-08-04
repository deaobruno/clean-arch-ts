import crypto from 'node:crypto'

export default class CryptoDriver {
  generateID = (): string => crypto.randomUUID()
  hashString = (text: string): string => crypto.createHash('sha256').update(text).digest('hex')
}
