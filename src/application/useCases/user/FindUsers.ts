import User from "../../../domain/user/User";
import IUserRepository from "../../../domain/user/IUserRepository";
import BaseError from "../../errors/BaseError";
import IUseCase from "../IUseCase";
import NotFoundError from "../../errors/NotFoundError";
import UserRole from "../../../domain/user/UserRole";

type FindUsersInput = {
  user: User;
  email?: string;
  limit?: string;
  page?: string;
};

type Output = User[] | BaseError;

export default class FindUsers implements IUseCase<FindUsersInput, Output> {
  constructor(private _userRepository: IUserRepository) {}

  async exec(input: FindUsersInput): Promise<Output> {
    const { user, limit, page, ...filters } = input;

    delete filters['refreshToken']

    const findOptions = {}
    
    findOptions['limit'] = limit ? parseInt(limit) : undefined
    findOptions['skip'] = page ? parseInt(page) : undefined

    let users = await this._userRepository.find({ role: UserRole.CUSTOMER, ...filters }, findOptions);

    if (!users || users.length <= 0)
      return new NotFoundError("Users not found");

    return users;
  }
}
