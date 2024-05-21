import Memo from '../../../domain/memo/Memo';
import IMemoRepository from '../../../domain/memo/IMemoRepository';
import BaseError from '../../errors/BaseError';
import IUseCase from '../IUseCase';
import NotFoundError from '../../errors/NotFoundError';
import User from '../../../domain/user/User';
import ILoggerDriver from '../../../infra/drivers/logger/ILoggerDriver';

type Input = {
  user: User;
  user_id: string;
  limit?: string;
  page?: string;
};

type Output = Memo[] | BaseError;

export default class FindMemosByUserId implements IUseCase<Input, Output> {
  constructor(
    private loggerDriver: ILoggerDriver,
    private memoRepository: IMemoRepository,
  ) {}

  async exec(input: Input): Promise<Output> {
    const { user, user_id, limit, page } = input;
    const { userId } = user;
    const findOptions = {};

    findOptions['limit'] = limit ? parseInt(limit) : undefined;
    findOptions['skip'] = page ? parseInt(page) : undefined;

    if (userId !== user_id && user.isCustomer) {
      const message = `[FindMemosByUserId] Memos not found for user: ${user_id}`;

      this.loggerDriver.debug({
        message,
        input,
        findOptions,
      });

      return new NotFoundError(message);
    }

    const memos = await this.memoRepository.findByUserId(user_id, findOptions);

    if (memos.length <= 0) {
      const message = `[FindMemosByUserId] Memos not found for user: ${user_id}`;

      this.loggerDriver.debug({
        message,
        input,
        findOptions,
      });

      return new NotFoundError(message);
    }

    this.loggerDriver.debug({
      message: '[FindMemosByUserId] Memos found',
      input,
      findOptions,
      memos,
    });

    return memos;
  }
}
