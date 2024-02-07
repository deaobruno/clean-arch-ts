import User from "../../domain/user/User";
import IDbDriver from "../../infra/drivers/db/IDbDriver";
import IUserRepository from "../../domain/user/IUserRepository";
import UserMapper from "../../domain/user/UserMapper";
import UserRole from "../../domain/user/UserRole";
import ICacheDriver from "../../infra/drivers/cache/ICacheDriver";

export default class UserRepository implements IUserRepository {
  constructor(
    private _source: string,
    private _dbDriver: IDbDriver,
    private _cacheDriver: ICacheDriver,
    private _mapper: UserMapper
  ) {}

  async create(user: User): Promise<void> {
    const dbUser = this._mapper.entityToDb(user);

    await this._dbDriver.create(this._source, dbUser);
  }

  async find(filters?: object, options = {}): Promise<User[]> {
    const users = await this._dbDriver.find(this._source, filters, options);

    return users.map(this._mapper.dbToEntity);
  }

  async findOne(filters: object): Promise<User | undefined> {
    const user = await this._dbDriver.findOne(this._source, filters);

    if (user) return this._mapper.dbToEntity(user);
  }

  async findOneById(user_id: string): Promise<User | undefined> {
    const cachedUser = this._cacheDriver.get(user_id);

    if (cachedUser) return cachedUser;

    const user = await this.findOne({ user_id });

    this._cacheDriver.set(user_id, user);

    return user;
  }

  async findOneByEmail(email: string): Promise<User | undefined> {
    const cachedUser = this._cacheDriver.get(email);

    if (cachedUser) return cachedUser;

    const user = await this.findOne({ email });

    this._cacheDriver.set(email, user);

    return user;
  }

  async findCustomers(): Promise<User[]> {
    const users = await this._dbDriver.find(this._source, {
      role: UserRole.CUSTOMER,
    });

    return users.map(this._mapper.dbToEntity);
  }

  async update(user: User): Promise<void> {
    const { userId: user_id, email } = user;
    const dbUser = this._mapper.entityToDb(user);

    await this._dbDriver.update(this._source, dbUser, {
      user_id,
    });

    this._cacheDriver.del(user_id);
    this._cacheDriver.del(email);
  }

  async deleteOne(user: User): Promise<void> {
    const { userId: user_id, email } = user;

    await this._dbDriver.delete(this._source, { user_id });

    this._cacheDriver.del(user_id);
    this._cacheDriver.del(email);
  }
}
