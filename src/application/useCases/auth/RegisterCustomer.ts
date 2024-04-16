import User from '../../../domain/user/User';
import UserRole from '../../../domain/user/UserRole';
import IUserRepository from '../../../domain/user/IUserRepository';
import BaseError from '../../errors/BaseError';
import IUseCase from '../IUseCase';
import ConflictError from '../../errors/ConflictError';
import IHashDriver from '../../../infra/drivers/hash/IHashDriver';
import IEncryptionDriver from '../../../infra/drivers/encryption/IEncryptionDriver';

type RegisterCustomerInput = {
  email: string;
  password: string;
};

type Output = User | BaseError;

export default class RegisterCustomer
  implements IUseCase<RegisterCustomerInput, Output>
{
  constructor(
    private _hashDriver: IHashDriver,
    private _encryptionDriver: IEncryptionDriver,
    private _userRepository: IUserRepository,
  ) {}

  async exec(input: RegisterCustomerInput): Promise<Output> {
    const { email, password } = input;
    const userByEmail = await this._userRepository.findOneByEmail(email);

    if (userByEmail instanceof User)
      return new ConflictError('Email already in use');

    const user = User.create({
      userId: this._hashDriver.generateID(),
      email,
      password: await this._encryptionDriver.encrypt(password),
      role: UserRole.CUSTOMER,
    });

    await this._userRepository.create(user);

    return user;
  }
}
