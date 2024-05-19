import RefreshToken from '../../../domain/refreshToken/RefreshToken';
import IRefreshTokenRepository from '../../../domain/refreshToken/IRefreshTokenRepository';
import IUserRepository from '../../../domain/user/IUserRepository';
import ITokenDriver from '../../../infra/drivers/token/ITokenDriver';
import BaseError from '../../errors/BaseError';
import IUseCase from '../IUseCase';
import UnauthorizedError from '../../errors/UnauthorizedError';
import IEncryptionDriver from '../../../infra/drivers/encryption/IEncryptionDriver';
import ILoggerDriver from '../../../infra/drivers/logger/ILoggerDriver';
import InternalServerError from '../../errors/InternalServerError';

type Input = {
  email: string;
  password: string;
};

type Output =
  | {
      accessToken: string;
      refreshToken: string;
    }
  | BaseError;

export default class Login implements IUseCase<Input, Output> {
  constructor(
    private loggerDriver: ILoggerDriver,
    private encryptionDriver: IEncryptionDriver,
    private tokenDriver: ITokenDriver,
    private userRepository: IUserRepository,
    private refreshTokenRepository: IRefreshTokenRepository,
  ) {}

  async exec(input: Input): Promise<Output> {
    const { email, password } = input;
    const user = await this.userRepository.findOneByEmail(email);

    if (
      !user ||
      !(await this.encryptionDriver.compare(password, user.password))
    ) {
      this.loggerDriver.debug({
        message: '[Login] Authentication failed',
        input,
        user,
      });

      return new UnauthorizedError();
    }
    const { userId } = user;
    const userData = { id: userId };
    const accessToken = this.tokenDriver.generateAccessToken(userData);
    const refreshToken = this.tokenDriver.generateRefreshToken(userData);
    const refreshTokenEntity = RefreshToken.create({
      userId,
      token: refreshToken,
    });

    if (refreshTokenEntity instanceof Error) {
      this.loggerDriver.debug({
        message: '[Login] Unable to create RefreshToken entity',
        input,
        userId,
        error: refreshTokenEntity,
      });

      return new InternalServerError(refreshTokenEntity.message);
    }

    await this.refreshTokenRepository.create(refreshTokenEntity);

    this.loggerDriver.debug({
      message: '[Login] User logged in',
      input,
      userId,
      accessToken,
      refreshToken,
    });

    return {
      accessToken,
      refreshToken,
    };
  }
}
