import User from "../../../../src/domain/user/User";

export default {
  create(user: User): Promise<void> {
    return Promise.resolve(undefined);
  },
  find(filters: any): Promise<User[]> {
    return Promise.resolve([]);
  },
  findCustomers(): Promise<User[]> {
    return Promise.resolve([]);
  },
  findAdmins(): Promise<User[]> {
    return Promise.resolve([]);
  },
  findOne(filters: any): Promise<User | undefined> {
    return Promise.resolve(undefined);
  },
  findOneByEmail(): Promise<User | undefined> {
    return Promise.resolve(undefined);
  },
  update(user: User): Promise<void> {
    return Promise.resolve(undefined);
  },
  delete(): Promise<void> {
    return Promise.resolve(undefined);
  },
};
