import User from "../../../domain/user/User";
import UserRole from "../../../domain/user/UserRole";
import IUserRepository from "../../../domain/user/IUserRepository";
import IHashDriver from "../../../infra/drivers/hash/IHashDriver";
import BaseError from "../../errors/BaseError";
import IUseCase from "../IUseCase";
import ConflictError from "../../errors/ConflictError";
import InternalServerError from "../../errors/InternalServerError";

type CreateAdminInput = {
  email: string;
  password: string;
};

type Output = User | BaseError;

export default class CreateAdmin implements IUseCase<CreateAdminInput, Output> {
  constructor(
    private _userRepository: IUserRepository,
    private _cryptoDriver: IHashDriver
  ) {}

  async exec(input: CreateAdminInput): Promise<Output> {
    const { email, password } = input;
    const userByEmail = await this._userRepository.findOneByEmail(email);

    if (userByEmail && userByEmail.email === email)
      return new ConflictError("Email already in use");

    const user = User.create({
      userId: this._cryptoDriver.generateID(),
      email,
      password: this._cryptoDriver.hashString(password),
      level: UserRole.ADMIN,
    });

    if (user instanceof Error) return new InternalServerError(user.message);

    await this._userRepository.create(user);

    return user;
  }
}
