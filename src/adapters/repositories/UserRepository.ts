import User from "../../domain/user/User";
import IDbDriver from "../../infra/drivers/db/IDbDriver";
import IUserRepository from "../../domain/user/IUserRepository";
import UserMapper from "../../domain/user/UserMapper";
import UserRole from "../../domain/user/UserRole";

export default class UserRepository implements IUserRepository {
  constructor(
    private _source: string,
    private _dbDriver: IDbDriver,
    private _mapper: UserMapper
  ) {}

  async create(user: User): Promise<void> {
    const dbUser = this._mapper.entityToDb(user);

    await this._dbDriver.create(this._source, dbUser);
  }

  async find(filters?: object): Promise<User[]> {
    const users = await this._dbDriver.find(this._source, filters);

    return users.map(this._mapper.dbToEntity);
  }

  async findOne(filters: object): Promise<User | undefined> {
    const user = await this._dbDriver.findOne(this._source, filters);

    if (user) return this._mapper.dbToEntity(user);
  }

  async findOneByEmail(email: string): Promise<User | undefined> {
    const user = await this._dbDriver.findOne(this._source, { email });

    if (user) return this._mapper.dbToEntity(user);
  }

  async findCustomers(): Promise<User[]> {
    const users = await this._dbDriver.find(this._source, {
      role: UserRole.CUSTOMER,
    });

    return users.map(this._mapper.dbToEntity);
  }

  async update(user: User): Promise<void> {
    const dbUser = this._mapper.entityToDb(user);

    await this._dbDriver.update(this._source, dbUser, {
      user_id: user.userId,
    });
  }

  async delete(filters?: object): Promise<void> {
    await this._dbDriver.delete(this._source, filters);
  }
}
