import { LevelEnum, User, UserParams } from '../../../domain/User'
import IRepository from '../../../infra/drivers/db/IDbDriver'
import IUserRepository from '../../../domain/repositories/IUserRepository'
import { UserMapper } from '../../../domain/mappers/UserMapper'

export default class InMemoryUserRepository implements IUserRepository {
  constructor(
    private _source: string,
    private _dbDriver: IRepository,
    private _mapper: UserMapper,
  ) {}

  async save(params: UserParams): Promise<User> {
    const user = User.create(params)
    const dbUser = this._mapper.entityToDb(user)

    await this._dbDriver.save(this._source, dbUser, { user_id: user.userId })

    return user
  }

  async find(filters?: object): Promise<User[]> {
    const users = await this._dbDriver.find(this._source, filters)

    return users.map(this._mapper.dbToEntity)
  }

  async findOne(filters: object): Promise<User | undefined> {
    const user = await this._dbDriver.findOne(this._source, filters)

    if (user)
      return this._mapper.dbToEntity(user)
  }

  async findOneByEmail(email: string): Promise<User | undefined> {
    const user = await this._dbDriver.findOne(this._source, { email })

    if (user)
      return this._mapper.dbToEntity(user)
  }

  async findAdmins(): Promise<User[]> {
    const users = await this._dbDriver.find(this._source, { level: LevelEnum.ADMIN })

    return users.map(this._mapper.dbToEntity)
  }

  async findCustomers(): Promise<User[]> {
    const users = await this._dbDriver.find(this._source, { level: LevelEnum.CUSTOMER })

    return users.map(this._mapper.dbToEntity)
  }

  async delete(filters = {}): Promise<void> {
    await this._dbDriver.delete(this._source, filters)
  }
}
