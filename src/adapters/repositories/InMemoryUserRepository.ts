import { User } from '../../domain/User'
import UserRepository from '../../domain/repositories/UserRepository'
import InMemoryDriver from '../../infra/drivers/InMemoryDriver'

export default class InMemoryUserRepository extends InMemoryDriver<User> implements UserRepository {
  constructor() {
    super()
  }

  async findOneById(user_id: string): Promise<User | undefined> {
    return this.findOne({ user_id })
  }

  async findOneByEmail(email: string): Promise<User | undefined> {
    return this.findOne({ email })
  }

  async findAdmins(): Promise<User[]> {
    return this.find({ level: 0 })
  }

  async findCustomers(): Promise<User[]> {
    return this.find({ level: 1 })
  }
}
