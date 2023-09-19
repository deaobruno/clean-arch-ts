import { User } from '../User'

export default interface IUserRepository {
  save(data: any, filters?: object): Promise<User>
  find(filters?: object): Promise<User[]>
  findCustomers(): Promise<User[]>
  findAdmins(): Promise<User[]>
  findOne(filters: object): Promise<User | undefined>
  findOneByEmail(email: string): Promise<User | undefined>
  delete(filters: object): Promise<void>
}
