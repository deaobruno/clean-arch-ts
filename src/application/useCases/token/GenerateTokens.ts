import IRefreshTokenRepository from '../../../domain/refreshToken/IRefreshTokenRepository';
import RefreshToken from '../../../domain/refreshToken/RefreshToken';
import ILoggerDriver from '../../../infra/drivers/logger/ILoggerDriver';
import ITokenDriver from '../../../infra/drivers/token/ITokenDriver';
import BaseError from '../../errors/BaseError';
import InternalServerError from '../../errors/InternalServerError';
import IUseCase from '../IUseCase';

type Input = {
  userId: string;
  deviceId: string;
};

type Response = {
  accessToken: string;
  refreshToken: string;
};

type Output = Response | BaseError;

export default class GenerateTokens implements IUseCase<Input, Output> {
  constructor(
    private loggerDriver: ILoggerDriver,
    private tokenDriver: ITokenDriver,
    private refreshTokenRepository: IRefreshTokenRepository,
  ) {}

  async exec(input: Input): Promise<Output> {
    const { userId, deviceId } = input;
    const tokenData = {
      id: userId,
      deviceId,
    };
    const accessToken = this.tokenDriver.generateAccessToken(tokenData);
    const refreshToken = this.tokenDriver.generateRefreshToken(tokenData);
    const refreshTokenEntity = RefreshToken.create({
      userId,
      deviceId,
      token: refreshToken,
    });

    if (refreshTokenEntity instanceof Error) {
      this.loggerDriver.debug({
        message: '[GenerateTokens] Unable to create RefreshToken entity',
        input,
        userId,
        error: refreshTokenEntity,
      });

      return new InternalServerError(refreshTokenEntity.message);
    }

    await this.refreshTokenRepository.create(refreshTokenEntity);

    return {
      accessToken,
      refreshToken,
    };
  }
}
