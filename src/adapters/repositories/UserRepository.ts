import { User, UserParams } from '../../domain/User'
import IRepository from '../../infra/drivers/db/IDbDriver'
import IUserRepository from '../../domain/repositories/IUserRepository'
import { UserMapper } from '../../domain/mappers/UserMapper'

export default class UserRepository implements IUserRepository {
  constructor(
    private _dbDriver: IRepository,
    private _mapper: UserMapper,
  ) {}

  async save(params: UserParams): Promise<User> {
    const user = User.create(params)
    const dbUser = this._mapper.entityToDb(user)

    await this._dbDriver.save(dbUser, { user_id: user.userId })

    return user
  }

  async find(filters?: object): Promise<User[]> {
    const users = await this._dbDriver.find(filters)

    return users.map(this._mapper.dbToEntity)
  }

  async findOne(filters: object): Promise<User | undefined> {
    const user = await this._dbDriver.findOne(filters)

    if (user)
      return this._mapper.dbToEntity(user)
  }

  async findOneByEmail(email: string): Promise<User | undefined> {
    const user = await this._dbDriver.findOne({ email })

    if (user)
      return this._mapper.dbToEntity(user)
  }

  async findAdmins(): Promise<User[]> {
    const users = await this._dbDriver.find({ level: 1 })

    return users.map(this._mapper.dbToEntity)
  }

  async findCustomers(): Promise<User[]> {
    const users = await this._dbDriver.find({ level: 2 })

    return users.map(this._mapper.dbToEntity)
  }

  async delete(filters: object): Promise<void> {
    await this._dbDriver.delete(filters)
  }
}
