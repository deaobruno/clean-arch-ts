import IRefreshTokenRepository from '../../../domain/refreshToken/IRefreshTokenRepository';
import IUserRepository from '../../../domain/user/IUserRepository';
import BaseError from '../../errors/BaseError';
import IUseCase from '../IUseCase';
import NotFoundError from '../../errors/NotFoundError';
import IMemoRepository from '../../../domain/memo/IMemoRepository';
import ILoggerDriver from '../../../infra/drivers/logger/ILoggerDriver';

type Input = {
  user_id: string;
};

type Output = void | BaseError;

export default class DeleteUser implements IUseCase<Input, Output> {
  constructor(
    private loggerDriver: ILoggerDriver,
    private userRepository: IUserRepository,
    private refreshTokenRepository: IRefreshTokenRepository,
    private memoRepository: IMemoRepository,
  ) {}

  async exec(input: Input): Promise<Output> {
    const { user_id } = input;
    const user = await this.userRepository.findOneById(user_id);

    if (!user || user.isRoot) {
      const message = `[DeleteUser] User not found: ${user_id}`;

      this.loggerDriver.debug({
        message,
        input,
        user,
      });

      return new NotFoundError(message);
    }

    await this.userRepository.deleteOne(user);
    await this.refreshTokenRepository.deleteAllByUser(user);
    await this.memoRepository.deleteAllByUser(user);

    this.loggerDriver.debug({
      message: '[DeleteUser] User deleted',
      input,
      user,
    });
  }
}
