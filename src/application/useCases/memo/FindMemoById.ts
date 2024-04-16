import Memo from '../../../domain/memo/Memo';
import IMemoRepository from '../../../domain/memo/IMemoRepository';
import BaseError from '../../errors/BaseError';
import IUseCase from '../IUseCase';
import NotFoundError from '../../errors/NotFoundError';
import User from '../../../domain/user/User';

type Input = {
  user: User;
  memo_id: string;
};

type Output = Memo | BaseError;

export default class FindMemoById implements IUseCase<Input, Output> {
  constructor(private _memoRepository: IMemoRepository) {}

  async exec(input: Input): Promise<Output> {
    const { user, memo_id } = input;
    const memo = await this._memoRepository.findOneById(memo_id);

    if (!memo || (memo.userId !== user.userId && user.isCustomer))
      return new NotFoundError('Memo not found');

    return memo;
  }
}
