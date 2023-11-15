import User from "../../../domain/user/User";
import UserRole from "../../../domain/user/UserRole";
import IUserRepository from "../../../domain/user/IUserRepository";
import IHashDriver from "../../../infra/drivers/hash/IHashDriver";
import BaseError from "../../errors/BaseError";
import IUseCase from "../IUseCase";
import InternalServerError from "../../errors/InternalServerError";

type CreateRootInput = {
  email: string;
  password: string;
};

type Output = void | BaseError;

export default class CreateRoot implements IUseCase<CreateRootInput, Output> {
  constructor(
    private _userRepository: IUserRepository,
    private _cryptoDriver: IHashDriver
  ) {}

  async exec(input: CreateRootInput): Promise<Output> {
    const { email, password } = input;
    const userByEmail = await this._userRepository.findOneByEmail(email);

    if (!userByEmail) {
      const user = User.create({
        userId: this._cryptoDriver.generateID(),
        email,
        password: this._cryptoDriver.hashString(password),
        level: UserRole.ROOT,
      });

      if (user instanceof Error) return new InternalServerError(user.message);

      await this._userRepository.create(user);
    }
  }
}
