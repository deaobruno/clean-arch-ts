import User from "../../../domain/user/User";
import IUserRepository from "../../../domain/user/IUserRepository";
import BaseError from "../../errors/BaseError";
import IUseCase from "../IUseCase";
import NotFoundError from "../../errors/NotFoundError";
import IMemoRepository from "../../../domain/memo/IMemoRepository";

type FindUsersInput = {
  user: User;
  email?: string;
};

type Output = User[] | BaseError;

export default class FindUsers implements IUseCase<FindUsersInput, Output> {
  constructor(
    private _userRepository: IUserRepository,
    private _memoRepository: IMemoRepository
  ) {}

  async exec(input: FindUsersInput): Promise<Output> {
    const { user, ...filters } = input;
    let users = await this._userRepository.find(filters);

    users = users.filter((user) => !user.isRoot);

    if (!users || users.length <= 0)
      return new NotFoundError("Users not found");

    return Promise.all(
      users.map(async (user) => {
        const memos = await this._memoRepository.findByUserId(user.userId);

        memos.forEach(user.addMemo);

        return user;
      })
    );
  }
}
