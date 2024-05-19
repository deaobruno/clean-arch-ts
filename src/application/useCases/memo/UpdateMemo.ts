import User from '../../../domain/user/User';
import Memo from '../../../domain/memo/Memo';
import BaseError from '../../errors/BaseError';
import IUseCase from '../IUseCase';
import NotFoundError from '../../errors/NotFoundError';
import IMemoRepository from '../../../domain/memo/IMemoRepository';
import ILoggerDriver from '../../../infra/drivers/logger/ILoggerDriver';
import InternalServerError from '../../errors/InternalServerError';

type UpdateMemoInput = {
  user: User;
  memo_id: string;
  title?: string;
  text?: string;
  start?: string;
  end?: string;
};

type Output = Memo | BaseError;

export default class UpdateMemo implements IUseCase<UpdateMemoInput, Output> {
  constructor(
    private loggerDriver: ILoggerDriver,
    private memoRepository: IMemoRepository,
  ) {}

  async exec(input: UpdateMemoInput): Promise<Output> {
    const { user, memo_id, ...memoInput } = input;
    const { title, text, start, end } = memoInput;
    const memo = await this.memoRepository.findOneById(memo_id);

    if (!memo || (memo.userId !== user.userId && user.isCustomer)) {
      const message = `[UpdateMemo] Memo not found: ${memo_id}`;

      this.loggerDriver.debug({
        message,
        input,
        memo,
      });

      return new NotFoundError(message);
    }

    const updatedMemo = Memo.create({
      memoId: memo.memoId,
      userId: memo.userId,
      title: title ?? memo.title,
      text: text ?? memo.text,
      start: start ?? memo.start,
      end: end ?? memo.end,
    });

    if (updatedMemo instanceof Error) {
      this.loggerDriver.debug({
        message: '[UpdateMemo] Unable to create Memo entity',
        input,
        error: updatedMemo,
      });

      return new InternalServerError(updatedMemo.message);
    }

    await this.memoRepository.update(updatedMemo);

    this.loggerDriver.debug({
      message: '[UpdateMemo] Memo updated',
      input,
      before: memo,
      after: updatedMemo,
    });

    return updatedMemo;
  }
}
