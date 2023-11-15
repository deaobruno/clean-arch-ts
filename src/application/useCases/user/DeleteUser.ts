import IRefreshTokenRepository from "../../../domain/refreshToken/IRefreshTokenRepository";
import IUserRepository from "../../../domain/user/IUserRepository";
import BaseError from "../../errors/BaseError";
import IUseCase from "../IUseCase";
import NotFoundError from "../../errors/NotFoundError";

type Input = {
  user_id: string;
};

type Output = void | BaseError;

export default class DeleteUser implements IUseCase<Input, Output> {
  constructor(
    private _userRepository: IUserRepository,
    private _refreshTokenRepository: IRefreshTokenRepository
  ) {}

  async exec(input: Input): Promise<Output> {
    const { user_id } = input;
    const user = await this._userRepository.findOne({ user_id });

    if (!user || user.isRoot) return new NotFoundError("User not found");

    await this._userRepository.delete({ user_id });
    await this._refreshTokenRepository.delete({ user_id });
  }
}
