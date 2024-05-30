import User from '../../../domain/user/User';
import IUserRepository from '../../../domain/user/IUserRepository';
import IUseCase from '../IUseCase';
import ILoggerDriver from '../../../infra/drivers/logger/ILoggerDriver';

type Output = User | undefined;

export default class FindUserByEmail implements IUseCase<string, Output> {
  constructor(
    private loggerDriver: ILoggerDriver,
    private userRepository: IUserRepository,
  ) {}

  async exec(email: string): Promise<Output> {
    const user = await this.userRepository.findOneByEmail(email);

    if (!user)
      this.loggerDriver.debug({
        message: `[FindUserByEmail] User not found: ${email}`,
      });

    this.loggerDriver.debug({
      message: '[FindUserByEmail] User found',
      email,
      user,
    });

    return user;
  }
}
