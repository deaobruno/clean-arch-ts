import User from './User';

export default interface IUserRepository {
  create(user: User): Promise<void>;
  find(filters?: object, options?: object): Promise<User[]>;
  findCustomers(): Promise<User[]>;
  findOne(filters: object): Promise<User | undefined>;
  findOneById(user_id: string): Promise<User | undefined>;
  findOneByEmail(email: string): Promise<User | undefined>;
  update(user: User, filters?: object): Promise<void>;
  deleteOne(user: User): Promise<void>;
}
