import { User } from '../User'
import IRepository from '../../infra/drivers/db/IDbDriver'

export default interface IUserRepository extends IRepository {
  findCustomers(): Promise<User[]>
  findAdmins(): Promise<User[]>
  findOneByEmail(email: string): Promise<User | undefined>
}
