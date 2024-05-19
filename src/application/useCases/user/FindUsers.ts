import User from '../../../domain/user/User';
import IUserRepository from '../../../domain/user/IUserRepository';
import BaseError from '../../errors/BaseError';
import IUseCase from '../IUseCase';
import NotFoundError from '../../errors/NotFoundError';
import UserRole from '../../../domain/user/UserRole';
import ILoggerDriver from '../../../infra/drivers/logger/ILoggerDriver';

type FindUsersInput = {
  user?: User;
  email?: string;
  limit?: string;
  page?: string;
};

type Output = User[] | BaseError;

export default class FindUsers implements IUseCase<FindUsersInput, Output> {
  constructor(
    private loggerDriver: ILoggerDriver,
    private userRepository: IUserRepository,
  ) {}

  async exec(input: FindUsersInput): Promise<Output> {
    const { limit, page, ...filters } = input;

    delete filters['user'];
    delete filters['refreshToken'];

    const findOptions = {};

    if (limit) findOptions['limit'] = parseInt(limit);
    if (page) findOptions['skip'] = parseInt(page);

    const findFilters = { role: UserRole.CUSTOMER, ...filters };
    const users = await this.userRepository.find(findFilters, findOptions);

    if (!users || users.length <= 0) {
      const message = `[FindUsers] Users not found: ${JSON.stringify(filters)}`;

      this.loggerDriver.debug({
        message,
        input,
        findFilters,
        findOptions,
        users,
      });

      return new NotFoundError(message);
    }

    this.loggerDriver.debug({
      message: '[FindUsers] Users found',
      input,
      findFilters,
      findOptions,
      users,
    });

    return users;
  }
}
