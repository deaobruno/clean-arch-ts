import UserRole from '../../../domain/user/UserRole';
import User from '../../../domain/user/User';
import IPresenter from '../IPresenter';
import ILoggerDriver from '../../../infra/drivers/logger/ILoggerDriver';

type JsonUser = {
  id: string;
  email: string;
  role: string;
};

export default class AdminPresenter implements IPresenter {
  constructor(private logger: ILoggerDriver) {}

  toJson = (user: User): JsonUser => {
    const { userId, email, role } = user;
    const jsonUser = {
      id: userId,
      email,
      role: UserRole[role],
    };

    this.logger.debug({
      message: `[AdminPresenter/toJson] Formatted user`,
      user,
      jsonUser,
    });

    return jsonUser;
  };
}
