import TokenUserData from './ITokenUserData';

export default interface ITokenDriver {
  generateAccessToken(data: unknown, expiresIn?: number): string;
  generateRefreshToken(data: unknown, expiresIn?: number): string;
  validateAccessToken(token: string): TokenUserData;
  validateRefreshToken(token: string): unknown;
}
