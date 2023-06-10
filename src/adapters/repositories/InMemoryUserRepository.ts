import { User } from '../../domain/User'
import UserRepository from '../../domain/repositories/UserRepository'
import InMemoryDriver from '../../infra/drivers/InMemoryDriver'

export default class InMemoryUserRepository extends InMemoryDriver<User> implements UserRepository {
  constructor() {
    super()
  }

  findAdmins(): Promise<User[]> {
    return this.find({ level: 0 })
  }

  findCustomers(): Promise<User[]> {
    return this.find({ level: 1 })
  }

  findOneByEmail(email: string): Promise<User | undefined> {
    return this.findOne({ email })
  }
}
