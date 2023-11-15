import UserRole from "./UserRole";
import IUserData from "./IUserData";

export default class User {
  readonly userId: string;
  public email: string;
  public password: string;
  readonly level: number;

  private constructor(params: IUserData) {
    const { userId, email, password, level } = params;

    this.userId = userId;
    this.email = email;
    this.password = password;
    this.level = level;
  }

  get isRoot(): boolean {
    return this.level === UserRole.ROOT;
  }

  get isAdmin(): boolean {
    return this.level === UserRole.ADMIN;
  }

  get isCustomer(): boolean {
    return this.level === UserRole.CUSTOMER;
  }

  static create(params: IUserData): User {
    const { userId, email, password, level } = params;
    const uuidRegex =
      /^[0-9a-f]{8}\b-[0-9a-f]{4}\b-[0-9a-f]{4}\b-[0-9a-f]{4}\b-[0-9a-f]{12}$/gi;
    const emailRegex =
      /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/gi;

    if (!userId) throw new Error('User: "userId" required');

    if (!userId || (userId && !uuidRegex.test(userId)))
      throw new Error('User: Invalid "userId"');

    if (!email) throw new Error('User: "email" required');

    if (!emailRegex.test(email)) throw new Error('User: Invalid "email"');

    if (!password) throw new Error('User: "password" required');

    if (!Object.values(UserRole).includes(level))
      throw new Error('User: Invalid "level"');

    return new User(params);
  }
}
