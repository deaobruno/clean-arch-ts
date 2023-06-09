export default class CryptoAdapter {
  static generateID(): string {
    return crypto.randomUUID()
  }
}
