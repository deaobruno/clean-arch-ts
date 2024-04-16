import User from '../../../domain/user/User';
import UserRole from '../../../domain/user/UserRole';
import IUserRepository from '../../../domain/user/IUserRepository';
import IHashDriver from '../../../infra/drivers/hash/IHashDriver';
import BaseError from '../../errors/BaseError';
import IUseCase from '../IUseCase';
import IEncryptionDriver from '../../../infra/drivers/encryption/IEncryptionDriver';

type CreateRootInput = {
  email: string;
  password: string;
};

type Output = void | BaseError;

export default class CreateRoot implements IUseCase<CreateRootInput, Output> {
  constructor(
    private _cryptoDriver: IHashDriver,
    private _encryptionDriver: IEncryptionDriver,
    private _userRepository: IUserRepository,
  ) {}

  async exec(input: CreateRootInput): Promise<Output> {
    const { email, password } = input;
    const userByEmail = await this._userRepository.findOneByEmail(email);

    if (!userByEmail) {
      const user = User.create({
        userId: this._cryptoDriver.generateID(),
        email,
        password: await this._encryptionDriver.encrypt(password),
        role: UserRole.ROOT,
      });

      await this._userRepository.create(user);
    }
  }
}
