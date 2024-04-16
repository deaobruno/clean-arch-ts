import Memo from '../../../domain/memo/Memo';
import IMemoRepository from '../../../domain/memo/IMemoRepository';
import BaseError from '../../errors/BaseError';
import IUseCase from '../IUseCase';
import NotFoundError from '../../errors/NotFoundError';
import User from '../../../domain/user/User';

type Input = {
  user: User;
  user_id: string;
  limit?: string;
  page?: string;
};

type Output = Memo[] | BaseError;

export default class FindMemosByUserId implements IUseCase<Input, Output> {
  constructor(private _memoRepository: IMemoRepository) {}

  async exec(input: Input): Promise<Output> {
    const { user, user_id, limit, page } = input;

    const findOptions = {};

    findOptions['limit'] = limit ? parseInt(limit) : undefined;
    findOptions['skip'] = page ? parseInt(page) : undefined;

    if (user.userId !== user_id && user.isCustomer)
      return new NotFoundError('Memos not found');

    const memos = await this._memoRepository.findByUserId(user_id, findOptions);

    if (memos.length <= 0) return new NotFoundError('Memos not found');

    return memos;
  }
}
