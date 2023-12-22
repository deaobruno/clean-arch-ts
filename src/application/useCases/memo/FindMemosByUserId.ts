import Memo from "../../../domain/memo/Memo";
import IMemoRepository from "../../../domain/memo/IMemoRepository";
import BaseError from "../../errors/BaseError";
import IUseCase from "../IUseCase";
import NotFoundError from "../../errors/NotFoundError";
import User from "../../../domain/user/User";

type Input = {
  user: User;
  user_id: string;
};

type Output = Memo[] | BaseError;

export default class FindMemosByUserId implements IUseCase<Input, Output> {
  constructor(private _memoRepository: IMemoRepository) {}

  async exec(input: Input): Promise<Output> {
    const { user, user_id } = input;

    if (user.userId !== user_id && user.isCustomer)
      return new NotFoundError("Memos not found");

    const memos = await this._memoRepository.findByUserId(user_id);

    if (!memos) return new NotFoundError("Memos not found");

    return memos;
  }
}
