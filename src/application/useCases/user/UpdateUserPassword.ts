import User from "../../../domain/user/User";
import IRefreshTokenRepository from "../../../domain/refreshToken/IRefreshTokenRepository";
import IUserRepository from "../../../domain/user/IUserRepository";
import BaseError from "../../errors/BaseError";
import IUseCase from "../IUseCase";
import NotFoundError from "../../errors/NotFoundError";
import IEncryptionDriver from "../../../infra/drivers/encryption/IEncryptionDriver";

type UpdateUserPasswordInput = {
  user: User;
  user_id: string;
  password: string;
};

type Output = User | BaseError;

export default class UpdateUserPassword
  implements IUseCase<UpdateUserPasswordInput, Output>
{
  constructor(
    private _encryptionDriver: IEncryptionDriver,
    private _userRepository: IUserRepository,
    private _refreshTokenRepository: IRefreshTokenRepository
  ) {}

  async exec(input: UpdateUserPasswordInput): Promise<Output> {
    const { user: requestUser, user_id, password } = input;

    if (requestUser.isCustomer && requestUser.userId !== user_id)
      return new NotFoundError("User not found");

    const user = await this._userRepository.findOneById(user_id);

    if (!user || user.isRoot) return new NotFoundError("User not found");

    const updatedUser = User.create({
      userId: user.userId,
      email: user.email,
      password: password
        ? await this._encryptionDriver.encrypt(password)
        : user.password,
      role: user.role,
    });

    await this._userRepository.update(updatedUser);
    await this._refreshTokenRepository.deleteAllByUser(updatedUser);

    return updatedUser;
  }
}
