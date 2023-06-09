import { User } from '../User'
import Repository from './Repository'

export default interface UserRepository extends Repository<User> {
  findCustomers(): Promise<User[]>
  findAdmins(): Promise<User[]>
  findOneByEmail(email: string): Promise<User | undefined>
}
