import User from '../../../domain/user/User';
import UserRole from '../../../domain/user/UserRole';
import IUserRepository from '../../../domain/user/IUserRepository';
import BaseError from '../../errors/BaseError';
import IUseCase from '../IUseCase';
import ConflictError from '../../errors/ConflictError';
import IHashDriver from '../../../infra/drivers/hash/IHashDriver';
import IEncryptionDriver from '../../../infra/drivers/encryption/IEncryptionDriver';
import ILoggerDriver from '../../../infra/drivers/logger/ILoggerDriver';
import InternalServerError from '../../errors/InternalServerError';

type RegisterCustomerInput = {
  email: string;
  password: string;
};

type Output = User | BaseError;

export default class RegisterCustomer
  implements IUseCase<RegisterCustomerInput, Output>
{
  constructor(
    private loggerDriver: ILoggerDriver,
    private hashDriver: IHashDriver,
    private encryptionDriver: IEncryptionDriver,
    private userRepository: IUserRepository,
  ) {}

  async exec(input: RegisterCustomerInput): Promise<Output> {
    const { email, password } = input;
    const userByEmail = await this.userRepository.findOneByEmail(email);

    if (userByEmail instanceof User) {
      const message = `[RegisterCustomer] Email already in use: ${email}`;

      this.loggerDriver.debug({
        message,
        input,
      });

      return new ConflictError(message);
    }

    const user = User.create({
      userId: this.hashDriver.generateID(),
      email,
      password: await this.encryptionDriver.encrypt(password),
      role: UserRole.CUSTOMER,
    });

    if (user instanceof Error) {
      this.loggerDriver.debug({
        message: '[RegisterCustomer] Unable to create User entity',
        input,
        error: user,
      });

      return new InternalServerError(user.message);
    }

    await this.userRepository.create(user);

    this.loggerDriver.debug({
      message: '[RegisterCustomer] New customer registered',
      input,
      customer: user,
    });

    return user;
  }
}
