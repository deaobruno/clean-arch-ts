import UserRole from './UserRole';
import IUserData from './IUserData';
import Memo from '../memo/Memo';

export default class User {
  readonly userId: string;
  public email: string;
  public password: string;
  readonly role: number;
  readonly memos: Memo[] = [];

  private constructor(params: IUserData) {
    const { userId, email, password, role } = params;

    this.userId = userId;
    this.email = email;
    this.password = password;
    this.role = role;
  }

  get isRoot(): boolean {
    return this.role === UserRole.ROOT;
  }

  get isCustomer(): boolean {
    return this.role === UserRole.CUSTOMER;
  }

  addMemo = (memo: Memo): void | Error => {
    const userMemos = this.memos.filter(
      (userMemo) => userMemo.memoId === memo.memoId,
    );

    if (userMemos.length > 0)
      return new Error('[User] Memo already added to user');

    this.memos.push(memo);
  };

  static create(params: IUserData): User | Error {
    const { userId, email, password, role } = params;
    const uuidRegex =
      /^[0-9a-f]{8}\b-[0-9a-f]{4}\b-[0-9a-f]{4}\b-[0-9a-f]{4}\b-[0-9a-f]{12}$/i;
    const emailRegex =
      /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/i;

    if (!userId) return new Error('[User] "userId" required');

    if (!uuidRegex.test(userId)) return new Error('[User] Invalid "userId"');

    if (!email) return new Error('[User] "email" required');

    if (!emailRegex.test(email)) return new Error('[User] Invalid "email"');

    if (!password) return new Error('[User] "password" required');

    if (!Object.values(UserRole).includes(role))
      return new Error('[User] Invalid "role"');

    return new User(params);
  }
}
