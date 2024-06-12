import IRefreshTokenRepository from '../../../domain/refreshToken/IRefreshTokenRepository';
import BaseError from '../../errors/BaseError';
import IUseCase from '../IUseCase';
import RefreshToken from '../../../domain/refreshToken/RefreshToken';
import ILoggerDriver from '../../../infra/drivers/logger/ILoggerDriver';

type Input = {
  refreshToken: RefreshToken;
};

type Output = void | BaseError;

export default class Logout implements IUseCase<Input, Output> {
  constructor(
    private loggerDriver: ILoggerDriver,
    private refreshTokenRepository: IRefreshTokenRepository,
  ) {}

  async exec(input: Input): Promise<Output> {
    const { refreshToken } = input;
    const { userId } = refreshToken;

    await this.refreshTokenRepository.deleteOne(refreshToken);

    this.loggerDriver.debug({
      message: '[Logout] User logged out',
      input,
      userId,
      refreshToken,
    });
  }
}
