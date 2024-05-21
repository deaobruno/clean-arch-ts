import User from '../../../domain/user/User';
import ILoggerDriver from '../../../infra/drivers/logger/ILoggerDriver';
import IPresenter from '../IPresenter';

type JsonUser = {
  id: string;
  email: string;
};

export default class CustomerPresenter implements IPresenter {
  constructor(private logger: ILoggerDriver) {}

  toJson = (user: User): JsonUser => {
    const { userId, email } = user;
    const jsonUser = {
      id: userId,
      email,
    };

    this.logger.debug({
      message: `[CustomerPresenter/toJson] Formatted user`,
      user,
      jsonUser,
    });

    return jsonUser;
  };
}
