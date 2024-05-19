import User from '../../../domain/user/User';
import IRefreshTokenRepository from '../../../domain/refreshToken/IRefreshTokenRepository';
import IUserRepository from '../../../domain/user/IUserRepository';
import BaseError from '../../errors/BaseError';
import IUseCase from '../IUseCase';
import NotFoundError from '../../errors/NotFoundError';
import IEncryptionDriver from '../../../infra/drivers/encryption/IEncryptionDriver';
import ILoggerDriver from '../../../infra/drivers/logger/ILoggerDriver';
import InternalServerError from '../../errors/InternalServerError';

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
    private loggerDriver: ILoggerDriver,
    private encryptionDriver: IEncryptionDriver,
    private userRepository: IUserRepository,
    private refreshTokenRepository: IRefreshTokenRepository,
  ) {}

  async exec(input: UpdateUserPasswordInput): Promise<Output> {
    const { user: requestUser, user_id, password } = input;

    if (requestUser.isCustomer && requestUser.userId !== user_id) {
      const message = `[UpdateUserPassword] User not found: ${user_id}`;

      this.loggerDriver.debug({
        message,
        input,
      });

      return new NotFoundError(message);
    }

    const user = await this.userRepository.findOneById(user_id);

    if (!user || user.isRoot) {
      const message = `[UpdateUserPassword] User not found: ${user_id}`;

      this.loggerDriver.debug({
        message,
        input,
        user,
      });

      return new NotFoundError(message);
    }

    const updatedUser = User.create({
      userId: user.userId,
      email: user.email,
      password: password
        ? await this.encryptionDriver.encrypt(password)
        : user.password,
      role: user.role,
    });

    if (updatedUser instanceof Error) {
      this.loggerDriver.debug({
        message: '[UpdateUserPassword] Unable to create User entity',
        input,
        user,
        error: updatedUser,
      });

      return new InternalServerError(updatedUser.message);
    }

    await this.userRepository.update(updatedUser);
    await this.refreshTokenRepository.deleteAllByUser(updatedUser);

    this.loggerDriver.debug({
      message: '[UpdateUserPassword] User updated',
      input,
      before: user,
      after: updatedUser,
    });

    return updatedUser;
  }
}
