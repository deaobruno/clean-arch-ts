import { User } from '../../../domain/User'
import IUserRepository from '../../../domain/repositories/IUserRepository'
import InMemoryDriver from '../../../infra/drivers/InMemoryDriver'

export default class InMemoryUserRepository implements IUserRepository {
  constructor(private _driver: InMemoryDriver) {}

  find = (filters?: object) => (this._driver.find)(filters)
  findOne = (filters: object) => (this._driver.findOne)(filters)
  delete = (filters: object) => (this._driver.delete)(filters)

  async save(entity: User) {
    return this._driver.save(entity, { user_id: entity.user_id })
  }

  async findOneByEmail(email: string): Promise<User | undefined> {
    return this._driver.findOne({ email })
  }

  async findAdmins(): Promise<User[]> {
    return this._driver.find({ level: 1 })
  }

  async findCustomers(): Promise<User[]> {
    return this._driver.find({ level: 2 })
  }
}
