import User from "../../../domain/user/User";
import IUserRepository from "../../../domain/user/IUserRepository";
import BaseError from "../../errors/BaseError";
import IUseCase from "../IUseCase";
import NotFoundError from "../../errors/NotFoundError";

type Input = {
  user: User;
  user_id: string;
};

type Output = User | BaseError;

export default class FindUserById implements IUseCase<Input, Output> {
  constructor(private _userRepository: IUserRepository) {}

  async exec(input: Input): Promise<Output> {
    const { user: requestUser, user_id } = input;

    if (requestUser.isCustomer && requestUser.userId !== user_id)
      return new NotFoundError("User not found");

    const user = await this._userRepository.findOneById(user_id);

    if (!user || user.isRoot) return new NotFoundError("User not found");

    return user;
  }
}
