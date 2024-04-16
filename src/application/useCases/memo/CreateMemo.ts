import IMemoRepository from '../../../domain/memo/IMemoRepository';
import Memo from '../../../domain/memo/Memo';
import User from '../../../domain/user/User';
import IHashDriver from '../../../infra/drivers/hash/IHashDriver';
import BaseError from '../../errors/BaseError';
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
    private _cryptoDriver: IHashDriver,
    private _memoRepository: IMemoRepository,
  ) {}

  async exec(input: CreateMemoInput): Promise<Output> {
    const { user, title, text, start, end } = input;
    const memo = Memo.create({
      memoId: this._cryptoDriver.generateID(),
      userId: user.userId,
      title,
      text,
      start,
      end,
    });

    await this._memoRepository.create(memo);

    return memo;
  }
}
