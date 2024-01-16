import IRefreshTokenRepository from "../../../domain/refreshToken/IRefreshTokenRepository";
import BaseError from "../../errors/BaseError";
import IUseCase from "../IUseCase";
import NotFoundError from "../../errors/NotFoundError";
import User from "../../../domain/user/User";
import ForbiddenError from "../../errors/ForbiddenError";

type Input = {
  user: User;
};

type Output = void | BaseError;

export default class DeleteRefreshToken implements IUseCase<Input, Output> {
  constructor(private _refreshTokenRepository: IRefreshTokenRepository) {}

  async exec(payload: Input): Promise<Output> {
    const {
      user: { userId },
    } = payload;
    const refreshToken = await this._refreshTokenRepository.findOneByUserId(
      userId
    );

    if (!refreshToken) return new NotFoundError("Refresh token not found");

    if (userId !== refreshToken.userId)
      return new ForbiddenError("Token does not belong to user");

    await this._refreshTokenRepository.deleteAllByUserId(userId);
  }
}
