import User from '../../../domain/user/User';
import IUserRepository from '../../../domain/user/IUserRepository';
import BaseError from '../../errors/BaseError';
import IUseCase from '../IUseCase';
import NotFoundError from '../../errors/NotFoundError';
import ILoggerDriver from '../../../infra/drivers/logger/ILoggerDriver';

type Input = {
  user: User;
  user_id: string;
};

type Output = User | BaseError;

export default class FindUserById implements IUseCase<Input, Output> {
  constructor(
    private loggerDriver: ILoggerDriver,
    private userRepository: IUserRepository,
  ) {}

  async exec(input: Input): Promise<Output> {
    const { user: requestUser, user_id } = input;

    if (requestUser.isCustomer && requestUser.userId !== user_id) {
      const message = `[FindUserById] User not found: ${user_id}`;

      this.loggerDriver.debug({
        message,
        input,
      });

      return new NotFoundError(message);
    }

    const user = await this.userRepository.findOneById(user_id);

    if (!user || user.isRoot) {
      const message = `[FindUserById] User not found: ${user_id}`;

      this.loggerDriver.debug({
        message,
        input,
        user,
      });

      return new NotFoundError(message);
    }

    this.loggerDriver.debug({
      message: '[FindUserById] User found',
      input,
      user,
    });

    return user;
  }
}
