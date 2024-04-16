export default interface IEncryptionDriver {
  encrypt(text: string, saltRounds?: number): Promise<string>
  compare(text: string, hash: string): Promise<boolean>
}
