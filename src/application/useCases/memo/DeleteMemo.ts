import IMemoRepository from "../../../domain/memo/IMemoRepository";
import BaseError from "../../errors/BaseError";
import IUseCase from "../IUseCase";
import NotFoundError from "../../errors/NotFoundError";
import User from "../../../domain/user/User";

type Input = {
  user: User;
  memo_id: string;
};

type Output = void | BaseError;

export default class DeleteMemo implements IUseCase<Input, Output> {
  constructor(private _memoRepository: IMemoRepository) {}

  async exec(input: Input): Promise<Output> {
    const { user, memo_id } = input;
    const memo = await this._memoRepository.findOne({ memo_id });

    if (!memo || (memo.userId !== user.userId && user.isCustomer))
      return new NotFoundError("Memo not found");

    await this._memoRepository.delete({ memo_id });
  }
}
