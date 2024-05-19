import User from '../../../domain/user/User';
import IRefreshTokenRepository from '../../../domain/refreshToken/IRefreshTokenRepository';
import IUserRepository from '../../../domain/user/IUserRepository';
import BaseError from '../../errors/BaseError';
import IUseCase from '../IUseCase';
import NotFoundError from '../../errors/NotFoundError';
import ConflictError from '../../errors/ConflictError';
import ILoggerDriver from '../../../infra/drivers/logger/ILoggerDriver';
import InternalServerError from '../../errors/InternalServerError';

type UpdateUserInput = {
  user: User;
  user_id: string;
  email?: string;
};

type Output = User | BaseError;

export default class UpdateUser implements IUseCase<UpdateUserInput, Output> {
  constructor(
    private loggerDriver: ILoggerDriver,
    private userRepository: IUserRepository,
    private refreshTokenRepository: IRefreshTokenRepository,
  ) {}

  async exec(input: UpdateUserInput): Promise<Output> {
    const { user: requestUser, user_id, ...userInput } = input;
    const { email } = userInput;

    if (requestUser.isCustomer && requestUser.userId !== user_id) {
      const message = `[UpdateUser] User not found: ${user_id}`;

      this.loggerDriver.debug({
        message,
        input,
      });

      return new NotFoundError(message);
    }

    const user = await this.userRepository.findOneById(user_id);

    if (!user || user.isRoot) {
      const message = `[UpdateUser] User not found: ${user_id}`;

      this.loggerDriver.debug({
        message,
        input,
        user,
      });

      return new NotFoundError(message);
    }

    if (email) {
      const userByEmail = await this.userRepository.findOneByEmail(email);

      if (userByEmail instanceof User && user.userId !== userByEmail.userId) {
        const message = `[UpdateUser] Email already in use: ${email}`;

        this.loggerDriver.debug({
          message,
          input,
          user,
          userByEmail,
        });

        return new ConflictError(message);
      }
    }

    const updatedUser = User.create({
      userId: user.userId,
      email: email ?? user.email,
      password: user.password,
      role: user.role,
    });

    if (updatedUser instanceof Error) {
      this.loggerDriver.debug({
        message: '[UpdateUser] Unable to create User entity',
        input,
        user,
        error: updatedUser,
      });

      return new InternalServerError(updatedUser.message);
    }

    await this.userRepository.update(updatedUser);
    await this.refreshTokenRepository.deleteAllByUser(updatedUser);

    this.loggerDriver.debug({
      message: '[UpdateUser] User updated',
      input,
      before: user,
      after: updatedUser,
    });

    return updatedUser;
  }
}
