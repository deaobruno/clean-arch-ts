export default interface IHashDriver {
  generateID(): string
  hashString(text: string): string
}
