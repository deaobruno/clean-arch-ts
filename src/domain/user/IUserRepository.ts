import User from "./User";

export default interface IUserRepository {
  create(data: User): Promise<void>;
  find(filters?: object): Promise<User[]>;
  findCustomers(): Promise<User[]>;
  findOne(filters: object): Promise<User | undefined>;
  findOneByEmail(email: string): Promise<User | undefined>;
  update(data: User, filters?: object): Promise<void>;
  delete(filters: object): Promise<void>;
}
