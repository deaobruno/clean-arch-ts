import RefreshToken from '../../../domain/refreshToken/RefreshToken';
import IRefreshTokenRepository from '../../../domain/refreshToken/IRefreshTokenRepository';
import IUserRepository from '../../../domain/user/IUserRepository';
import ITokenDriver from '../../../infra/drivers/token/ITokenDriver';
import BaseError from '../../errors/BaseError';
import IUseCase from '../IUseCase';
import UnauthorizedError from '../../errors/UnauthorizedError';
import IEncryptionDriver from '../../../infra/drivers/encryption/IEncryptionDriver';

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
    private _encryptionDriver: IEncryptionDriver,
    private _tokenDriver: ITokenDriver,
    private _userRepository: IUserRepository,
    private _refreshTokenRepository: IRefreshTokenRepository,
  ) {}

  async exec(input: Input): Promise<Output> {
    const { email, password } = input;
    const user = await this._userRepository.findOneByEmail(email);

    if (
      !user ||
      !(await this._encryptionDriver.compare(password, user.password))
    )
      return new UnauthorizedError();

    const { userId } = user;
    const userData = { id: userId };
    const accessToken = this._tokenDriver.generateAccessToken(userData);
    const refreshToken = this._tokenDriver.generateRefreshToken(userData);
    const refreshTokenEntity = RefreshToken.create({
      userId,
      token: refreshToken,
    });

    await this._refreshTokenRepository.create(refreshTokenEntity);

    return {
      accessToken,
      refreshToken,
    };
  }
}
