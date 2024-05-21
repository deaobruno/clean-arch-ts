import IMemoRepository from '../../../domain/memo/IMemoRepository';
import Memo from '../../../domain/memo/Memo';
import User from '../../../domain/user/User';
import IHashDriver from '../../../infra/drivers/hash/IHashDriver';
import ILoggerDriver from '../../../infra/drivers/logger/ILoggerDriver';
import BaseError from '../../errors/BaseError';
import InternalServerError from '../../errors/InternalServerError';
import IUseCase from '../IUseCase';

type CreateMemoInput = {
  user: User;
  title: string;
  text: string;
  start: string;
  end: string;
};

type Output = Memo | BaseError;

export default class CreateMemo implements IUseCase<CreateMemoInput, Output> {
  constructor(
    private loggerDriver: ILoggerDriver,
    private cryptoDriver: IHashDriver,
    private memoRepository: IMemoRepository,
  ) {}

  async exec(input: CreateMemoInput): Promise<Output> {
    const { user, title, text, start, end } = input;
    const memo = Memo.create({
      memoId: this.cryptoDriver.generateID(),
      userId: user.userId,
      title,
      text,
      start,
      end,
    });

    if (memo instanceof Error) {
      this.loggerDriver.debug({
        message: '[CreateMemo] Unable to create Memo entity',
        input,
        error: memo,
      });

      return new InternalServerError(memo.message);
    }

    await this.memoRepository.create(memo);

    this.loggerDriver.debug({
      message: '[CreateMemo] New memo created',
      input,
      memo,
    });

    return memo;
  }
}
