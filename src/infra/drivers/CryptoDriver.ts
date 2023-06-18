export default class CryptoDriver {
  generateID(): string {
    return crypto.randomUUID()
  }
}
