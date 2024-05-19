import jwt, { JwtPayload } from 'jsonwebtoken';
import ITokenDriver from './ITokenDriver';
import ITokenUserData from './ITokenUserData';
import ILoggerDriver from '../logger/ILoggerDriver';
import ITokenRefreshTokenData from './ITokenRefreshTokenData';

export default class JwtDriver implements ITokenDriver {
  constructor(
    private logger: ILoggerDriver,
    private accessTokenSecret: string,
    private accessTokenExpirationTime: number,
    private refreshTokenSecret: string,
    private refreshTokenExpirationTime: number,
  ) {}

  private generateToken = (
    data: string | object,
    secret: string,
    expiresIn: number,
  ): string => jwt.sign(data, secret, { expiresIn });

  private validateToken = (token: string, secret: string): unknown => {
    const result = <JwtPayload>jwt.verify(token, secret);

    delete result.exp;
    delete result.iat;

    return result;
  };

  generateAccessToken(
    data: string | object,
    expiresIn = this.accessTokenExpirationTime,
  ): string {
    const secret = this.accessTokenSecret;
    const token = this.generateToken(data, secret, expiresIn);

    this.logger.debug({
      message: '[JwtDriver] Access token generated',
      data,
      secret,
      expiresIn,
      token,
    });

    return token;
  }

  generateRefreshToken(
    data: string | object,
    expiresIn = this.refreshTokenExpirationTime,
  ): string {
    const secret = this.refreshTokenSecret;
    const token = this.generateToken(data, secret, expiresIn);

    this.logger.debug({
      message: '[JwtDriver] Refresh token generated',
      data,
      secret,
      expiresIn,
      token,
    });

    return token;
  }

  validateAccessToken(token: string): ITokenUserData {
    const validation = <ITokenUserData>(
      this.validateToken(token, this.accessTokenSecret)
    );

    this.logger.debug({
      message: '[JwtDriver] Access token validation',
      token,
      validation,
    });

    return validation;
  }

  validateRefreshToken(token: string): ITokenRefreshTokenData {
    const validation = <ITokenRefreshTokenData>(
      this.validateToken(token, this.refreshTokenSecret)
    );

    this.logger.debug({
      message: '[JwtDriver] Refresh token validation',
      token,
      validation,
    });

    return validation;
  }
}
