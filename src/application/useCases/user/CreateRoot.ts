import User from '../../../domain/user/User';
import UserRole from '../../../domain/user/UserRole';
import IUserRepository from '../../../domain/user/IUserRepository';
import IHashDriver from '../../../infra/drivers/hash/IHashDriver';
import BaseError from '../../errors/BaseError';
import IUseCase from '../IUseCase';
import IEncryptionDriver from '../../../infra/drivers/encryption/IEncryptionDriver';
import ILoggerDriver from '../../../infra/drivers/logger/ILoggerDriver';

type CreateRootInput = {
  email: string;
  password: string;
};

type Output = void | BaseError;

export default class CreateRoot implements IUseCase<CreateRootInput, Output> {
  constructor(
    private loggerDriver: ILoggerDriver,
    private cryptoDriver: IHashDriver,
    private encryptionDriver: IEncryptionDriver,
    private userRepository: IUserRepository,
  ) {}

  async exec(input: CreateRootInput): Promise<Output> {
    const { email, password } = input;
    const userByEmail = await this.userRepository.findOneByEmail(email);

    if (userByEmail) {
      this.loggerDriver.debug({
        message: '[CreateRoot] Root user found',
        input,
        user: userByEmail,
      });

      return;
    }

    const user = User.create({
      userId: this.cryptoDriver.generateID(),
      email,
      password: await this.encryptionDriver.encrypt(password),
      role: UserRole.ROOT,
    });

    if (user instanceof Error) {
      this.loggerDriver.debug({
        message: '[CreateRoot] Unable to create User entity',
        input,
        error: user,
      });

      return;
    }

    await this.userRepository.create(user);

    this.loggerDriver.debug({
      message: '[CreateRoot] Root user created',
      input,
      user,
    });
  }
}
