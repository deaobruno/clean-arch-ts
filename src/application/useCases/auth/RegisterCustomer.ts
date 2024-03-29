import User from "../../../domain/user/User";
import UserRole from "../../../domain/user/UserRole";
import IUserRepository from "../../../domain/user/IUserRepository";
import CryptoDriver from "../../../infra/drivers/hash/CryptoDriver";
import BaseError from "../../errors/BaseError";
import IUseCase from "../IUseCase";
import ConflictError from "../../errors/ConflictError";

type RegisterCustomerInput = {
  email: string;
  password: string;
};

type Output = User | BaseError;

export default class RegisterCustomer
  implements IUseCase<RegisterCustomerInput, Output>
{
  constructor(
    private _userRepository: IUserRepository,
    private _cryptoDriver: CryptoDriver
  ) {}

  async exec(input: RegisterCustomerInput): Promise<Output> {
    const { email, password } = input;
    const userByEmail = await this._userRepository.findOneByEmail(email);

    if (userByEmail instanceof User)
      return new ConflictError("Email already in use");

    const user = User.create({
      userId: this._cryptoDriver.generateID(),
      email,
      password: this._cryptoDriver.hashString(password),
      role: UserRole.CUSTOMER,
    });

    await this._userRepository.create(user);

    return user;
  }
}
