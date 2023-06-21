import { User } from '../../domain/User'
import IRepository from '../../domain/repositories/IRepository'
import IUserRepository from '../../domain/repositories/IUserRepository'

export default class UserRepository implements IUserRepository {
  constructor(private _dbDriver: IRepository<User>) {}

  find = (filters?: object) => (this._dbDriver.find)(filters)
  findOne = (filters: object) => (this._dbDriver.findOne)(filters)
  delete = (filters: object) => (this._dbDriver.delete)(filters)

  async save(entity: User) {
    return this._dbDriver.save(entity, { user_id: entity.user_id })
  }

  async findOneByEmail(email: string): Promise<User | undefined> {
    return this._dbDriver.findOne({ email })
  }

  async findAdmins(): Promise<User[]> {
    return this._dbDriver.find({ level: 1 })
  }

  async findCustomers(): Promise<User[]> {
    return this._dbDriver.find({ level: 2 })
  }
}
