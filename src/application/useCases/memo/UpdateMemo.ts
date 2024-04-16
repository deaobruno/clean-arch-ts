import User from '../../../domain/user/User';
import Memo from '../../../domain/memo/Memo';
import BaseError from '../../errors/BaseError';
import IUseCase from '../IUseCase';
import NotFoundError from '../../errors/NotFoundError';
import IMemoRepository from '../../../domain/memo/IMemoRepository';

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
  constructor(private _memoRepository: IMemoRepository) {}

  async exec(input: UpdateMemoInput): Promise<Output> {
    const { user, memo_id, ...memoInput } = input;
    const { title, text, start, end } = memoInput;
    const memo = await this._memoRepository.findOneById(memo_id);

    if (!memo || (memo.userId !== user.userId && user.isCustomer))
      return new NotFoundError('Memo not found');

    const updatedMemo = Memo.create({
      memoId: memo.memoId,
      userId: memo.userId,
      title: title || memo.title,
      text: text || memo.text,
      start: start || memo.start,
      end: end || memo.end,
    });

    await this._memoRepository.update(updatedMemo);

    return updatedMemo;
  }
}
