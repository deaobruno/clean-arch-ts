import IMemoRepository from '../../../domain/memo/IMemoRepository';
import BaseError from '../../errors/BaseError';
import IUseCase from '../IUseCase';
import NotFoundError from '../../errors/NotFoundError';
import User from '../../../domain/user/User';
import ILoggerDriver from '../../../infra/drivers/logger/ILoggerDriver';

type Input = {
  user: User;
  memo_id: string;
};

type Output = void | BaseError;

export default class DeleteMemo implements IUseCase<Input, Output> {
  constructor(
    private loggerDriver: ILoggerDriver,
    private memoRepository: IMemoRepository,
  ) {}

  async exec(input: Input): Promise<Output> {
    const { user, memo_id } = input;
    const memo = await this.memoRepository.findOneById(memo_id);

    if (!memo || (memo.userId !== user.userId && user.isCustomer)) {
      const message = `[DeleteMemo] Memo not found: ${memo_id}`;

      this.loggerDriver.debug({
        message,
        input,
        memo,
      });

      return new NotFoundError(message);
    }

    await this.memoRepository.deleteOne(memo);

    this.loggerDriver.debug({
      message: '[DeleteMemo] Memo deleted',
      input,
      memo,
    });
  }
}
