import { User } from '../../../../src/domain/User'

export default {
  save(user: User): Promise<User> {
    return Promise.resolve(user)
  },
  find(filters: any): Promise<User[]> {
    return Promise.resolve([])
  },
  findCustomers(): Promise<User[]> {
    return Promise.resolve([])
  },
  findAdmins(): Promise<User[]> {
    return Promise.resolve([])
  },
  findOne(filters: any): Promise<User | undefined> {
    return Promise.resolve(undefined)
  },
  findOneByEmail(): Promise<User | undefined> {
    return Promise.resolve(undefined)
  },
  delete(): Promise<void> {
    return Promise.resolve(undefined)
  },
}
