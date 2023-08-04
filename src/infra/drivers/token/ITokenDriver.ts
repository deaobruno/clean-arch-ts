export default interface ITokenDriver {
  generateAccessToken(data: string | object): string
  generateRefreshToken(data: string | object): string
  validateAccessToken(token: string): any
  validateRefreshToken(token: string): any
}
