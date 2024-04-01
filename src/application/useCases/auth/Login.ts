import RefreshToken from "../../../domain/refreshToken/RefreshToken";
import IRefreshTokenRepository from "../../../domain/refreshToken/IRefreshTokenRepository";
import IUserRepository from "../../../domain/user/IUserRepository";
import CryptoDriver from "../../../infra/drivers/hash/CryptoDriver";
import ITokenDriver from "../../../infra/drivers/token/ITokenDriver";
import BaseError from "../../errors/BaseError";
import IUseCase from "../IUseCase";
import UnauthorizedError from "../../errors/UnauthorizedError";

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
    private _userRepository: IUserRepository,
    private _refreshTokenRepository: IRefreshTokenRepository,
    private _tokenDriver: ITokenDriver,
    private _cryptoDriver: CryptoDriver
  ) {}

  async exec(input: Input): Promise<Output> {
    const { email, password } = input;
    const user = await this._userRepository.findOneByEmail(email);

    if (!user || user.password !== this._cryptoDriver.hashString(password))
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
