import { User } from '../User'
import IRepository from './IRepository'

export default interface IUserRepository extends IRepository<User> {
  findCustomers(): Promise<User[]>
  findAdmins(): Promise<User[]>
  findOneByEmail(email: string): Promise<User | undefined>
}
