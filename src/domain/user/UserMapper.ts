import IMapper from '../IMapper';
import User from './User';
import IDbUser from './IDbUser';
import ILoggerDriver from '../../infra/drivers/logger/ILoggerDriver';

export default class UserMapper implements IMapper<User, IDbUser> {
  constructor(private logger: ILoggerDriver) {}

  entityToDb(user: User): IDbUser {
    const { userId, email, password, role } = user;
    const dbUser = {
      user_id: userId,
      email,
      password,
      role,
    };

    this.logger.debug({
      message: '[UserMapper/entityToDb] User entity mapped to db data',
      user,
      dbUser,
    });

    return dbUser;
  }

  dbToEntity(dbUser: IDbUser): User | Error {
    const { user_id, email, password, role } = dbUser;
    const user = User.create({
      userId: user_id,
      email,
      password,
      role,
    });

    this.logger.debug({
      message: '[UserMapper/entityToDb] User db data mapped to entity',
      dbUser,
      user,
    });

    return user;
  }
}
