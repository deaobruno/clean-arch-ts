import User from '../../domain/user/User';
import IDbDriver from '../../infra/drivers/db/IDbDriver';
import IUserRepository from '../../domain/user/IUserRepository';
import UserMapper from '../../domain/user/UserMapper';
import UserRole from '../../domain/user/UserRole';
import ICacheDriver from '../../infra/drivers/cache/ICacheDriver';
import IDbUser from '../../domain/user/IDbUser';
import ILoggerDriver from '../../infra/drivers/logger/ILoggerDriver';

export default class UserRepository implements IUserRepository {
  constructor(
    private source: string,
    private logger: ILoggerDriver,
    private db: IDbDriver<IDbUser>,
    private cache: ICacheDriver,
    private mapper: UserMapper,
  ) {}

  async create(user: User): Promise<void> {
    const dbUser = this.mapper.entityToDb(user);

    await this.db.create(this.source, dbUser);

    this.logger.debug({
      message: '[UserRepository/create] User created',
      user,
      dbUser,
    });
  }

  async find(filters?: object, options = {}): Promise<User[]> {
    const dbUsers = await this.db.find(this.source, filters, options);
    const users = dbUsers.map((user) => <User>this.mapper.dbToEntity(user));
    const message =
      users.length > 0
        ? '[UserRepository/find] User(s) found'
        : '[UserRepository/find] Users not found';

    this.logger.debug({
      message,
      filters,
      options,
      dbUsers,
      users,
    });

    return users;
  }

  async findCustomers(options = {}): Promise<User[]> {
    return this.find({
      role: UserRole.CUSTOMER,
      options,
    });
  }

  async findOne(filters: object): Promise<User | undefined> {
    const dbUser = await this.db.findOne(this.source, filters);

    if (!dbUser) {
      this.logger.debug({
        message: '[UserRepository/findOne] User not found',
        filters,
      });

      return;
    }

    const user = <User>this.mapper.dbToEntity(dbUser);

    this.logger.debug({
      message: '[UserRepository/findOne] User found',
      filters,
      dbUser,
      user,
    });

    return user;
  }

  async findOneById(user_id: string): Promise<User | undefined> {
    const cachedUser = <User>await this.cache.get(user_id);

    if (cachedUser) return cachedUser;

    const user = await this.findOne({ user_id });

    if (user) await this.cache.set(user_id, user);

    return user;
  }

  async findOneByEmail(email: string): Promise<User | undefined> {
    const cachedUser = <User>await this.cache.get(email);

    if (cachedUser) return cachedUser;

    const user = await this.findOne({ email });

    if (user) await this.cache.set(email, user);

    return user;
  }

  async update(user: User): Promise<void> {
    const { userId: user_id, email } = user;
    const dbUser = this.mapper.entityToDb(user);

    await this.db.update(this.source, dbUser, {
      user_id,
    });
    await this.cache.del(user_id);
    await this.cache.del(email);

    this.logger.debug({
      message: '[UserRepository/update] User updated',
      user,
      dbUser,
    });
  }

  async deleteOne(user: User): Promise<void> {
    const { userId: user_id, email } = user;

    await this.db.delete(this.source, { user_id });
    await this.cache.del(user_id);
    await this.cache.del(email);

    this.logger.debug({
      message: '[UserRepository/delete] User deleted',
      user,
    });
  }
}
