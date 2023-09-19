export default interface ITokenDriver {
  generateAccessToken(data: string | object, expiresIn?: number): string
  generateRefreshToken(data: string | object, expiresIn?: number): string
  validateAccessToken(token: string): any
  validateRefreshToken(token: string): any
}
