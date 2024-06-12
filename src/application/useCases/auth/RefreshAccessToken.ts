import RefreshToken from '../../../domain/refreshToken/RefreshToken';
import IRefreshTokenRepository from '../../../domain/refreshToken/IRefreshTokenRepository';
import ITokenDriver from '../../../infra/drivers/token/ITokenDriver';
import BaseError from '../../errors/BaseError';
import IUseCase from '../IUseCase';
import User from '../../../domain/user/User';
import ForbiddenError from '../../errors/ForbiddenError';
import ILoggerDriver from '../../../infra/drivers/logger/ILoggerDriver';
import InternalServerError from '../../errors/InternalServerError';

type Input = {
  user: User;
  refreshToken: RefreshToken;
};

type Output =
  | {
      accessToken: string;
      refreshToken: string;
    }
  | BaseError;

export default class RefreshAccessToken implements IUseCase<Input, Output> {
  constructor(
    private loggerDriver: ILoggerDriver,
    private tokenDriver: ITokenDriver,
    private refreshTokenRepository: IRefreshTokenRepository,
  ) {}

  async exec(input: Input) {
    const {
      user: { userId },
      refreshToken: oldToken,
    } = input;
    const { token } = oldToken;
    let userData;

    try {
      userData = this.tokenDriver.validateRefreshToken(token);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      const message =
        error.name === 'TokenExpiredError'
          ? `[RefreshAccessToken] Refresh token expired: ${token}`
          : `[RefreshAccessToken] Invalid refresh token: ${token}`;

      this.loggerDriver.debug({
        message,
        input,
        error,
      });

      return new ForbiddenError(message);
    }

    await this.refreshTokenRepository.deleteOne(oldToken);

    const accessToken = this.tokenDriver.generateAccessToken(userData);
    const refreshToken = this.tokenDriver.generateRefreshToken(userData);
    const refreshTokenEntity = RefreshToken.create({
      userId,
      token: refreshToken,
    });

    if (refreshTokenEntity instanceof Error) {
      this.loggerDriver.debug({
        message: '[RefreshAccessToken] Unable to create RefreshToken entity',
        input,
        error: refreshTokenEntity,
      });

      return new InternalServerError(refreshTokenEntity.message);
    }

    await this.refreshTokenRepository.create(refreshTokenEntity);
    await this.refreshTokenRepository.deleteOne(oldToken);

    this.loggerDriver.debug({
      message: '[RefreshAccessToken] User refreshed access token',
      input,
      accessToken,
      refreshToken,
    });

    return {
      accessToken,
      refreshToken,
    };
  }
}
