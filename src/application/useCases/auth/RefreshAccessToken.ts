import RefreshToken from "../../../domain/refreshToken/RefreshToken";
import IRefreshTokenRepository from "../../../domain/refreshToken/IRefreshTokenRepository";
import ITokenDriver from "../../../infra/drivers/token/ITokenDriver";
import BaseError from "../../errors/BaseError";
import IUseCase from "../IUseCase";
import User from "../../../domain/user/User";
import ForbiddenError from "../../errors/ForbiddenError";

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
    private _tokenDriver: ITokenDriver,
    private _refreshTokenRepository: IRefreshTokenRepository
  ) {}

  async exec(payload: Input) {
    const {
      user: { userId },
      refreshToken: oldToken,
    } = payload;
    const { token } = oldToken;
    let userData;

    try {
      userData = this._tokenDriver.validateRefreshToken(token);
    } catch (error: any) {
      return error.name === "TokenExpiredError"
        ? new ForbiddenError("Refresh token expired")
        : new ForbiddenError("Invalid refresh token");
    }

    await this._refreshTokenRepository.deleteOne(oldToken);

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
