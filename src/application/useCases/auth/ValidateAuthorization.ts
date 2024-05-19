import User from '../../../domain/user/User';
import BaseError from '../../errors/BaseError';
import IUseCase from '../IUseCase';
import ForbiddenError from '../../errors/ForbiddenError';
import ILoggerDriver from '../../../infra/drivers/logger/ILoggerDriver';

type Input = {
  user: User;
};

type Output = void | BaseError;

export default class ValidateAuthorization implements IUseCase<Input, Output> {
  constructor(private loggerDriver: ILoggerDriver) {}

  exec(input: Input): Output {
    const { user } = input;
    const { userId } = user;

    if (user.isCustomer) {
      const message = '[ValidateAuthorization] Action not allowed';

      this.loggerDriver.debug({
        message,
        input,
        userId,
      });

      return new ForbiddenError(message);
    }

    this.loggerDriver.debug({
      message: '[ValidateAuthorization] Successful authorization',
      input,
      userId,
    });
  }
}
