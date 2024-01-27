import IRefreshTokenRepository from "../../../domain/refreshToken/IRefreshTokenRepository";
import BaseError from "../../errors/BaseError";
import IUseCase from "../IUseCase";
import RefreshToken from "../../../domain/refreshToken/RefreshToken";

type Input = {
  refreshToken: RefreshToken;
};

type Output = void | BaseError;

export default class DeleteRefreshToken implements IUseCase<Input, Output> {
  constructor(private _refreshTokenRepository: IRefreshTokenRepository) {}

  async exec(payload: Input): Promise<Output> {
    await this._refreshTokenRepository.deleteOne(payload.refreshToken);
  }
}
