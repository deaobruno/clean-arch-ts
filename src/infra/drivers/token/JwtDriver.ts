import jwt, { JwtPayload } from 'jsonwebtoken';
import ITokenDriver from './ITokenDriver';
import TokenUserData from './ITokenUserData';

export default class JwtDriver implements ITokenDriver {
  constructor(
    private _accessTokenSecret: string,
    private _accessTokenExpirationTime: number,
    private _refreshTokenSecret: string,
    private _refreshTokenExpirationTime: number,
  ) {}

  private _generateToken = (
    data: string | object,
    secret: string,
    expiresIn: number,
  ): string => jwt.sign(data, secret, { expiresIn });

  private _validateToken = (token: string, secret: string): unknown => {
    const result = <JwtPayload>jwt.verify(token, secret);

    delete result.exp;
    delete result.iat;

    return result;
  };

  generateAccessToken(
    data: string | object,
    expiresIn = this._accessTokenExpirationTime,
  ): string {
    return this._generateToken(data, this._accessTokenSecret, expiresIn);
  }

  generateRefreshToken(
    data: string | object,
    expiresIn = this._refreshTokenExpirationTime,
  ): string {
    return this._generateToken(data, this._refreshTokenSecret, expiresIn);
  }

  validateAccessToken(token: string): TokenUserData {
    return <TokenUserData>this._validateToken(token, this._accessTokenSecret);
  }

  validateRefreshToken(token: string) {
    return this._validateToken(token, this._refreshTokenSecret);
  }
}
