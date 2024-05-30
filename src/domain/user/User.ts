import UserRole from './UserRole';
import IUserData from './IUserData';
import Memo from '../memo/Memo';
import Device from '../device/Device';

export default class User {
  readonly userId: string;
  public email: string;
  public password: string;
  readonly role: number;
  readonly memos: Memo[] = [];
  readonly devices: Device[] = [];

  private constructor(data: IUserData) {
    const { userId, email, password, role } = data;

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

    if (userMemos.length > 0) return Error('[User] Memo already added to user');

    this.memos.push(memo);
  };

  addDevice = (device: Device): void | Error => {
    const userDevices = this.devices.filter(
      (userDevice) => userDevice.deviceId === device.deviceId,
    );

    if (userDevices.length > 0)
      return Error('[User] Device already added to user');

    this.devices.push(device);
  };

  static create(data: IUserData): User | Error {
    const { userId, email, password, role } = data;
    const uuidRegex =
      /^[0-9a-f]{8}\b-[0-9a-f]{4}\b-[0-9a-f]{4}\b-[0-9a-f]{4}\b-[0-9a-f]{12}$/i;
    const emailRegex =
      /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/i;

    if (!userId) return Error('[User] "userId" required');

    if (!uuidRegex.test(userId)) return Error('[User] Invalid "userId"');

    if (!email) return Error('[User] "email" required');

    if (!emailRegex.test(email)) return Error('[User] Invalid "email"');

    if (!password) return Error('[User] "password" required');

    if (!Object.values(UserRole).includes(role))
      return Error('[User] Invalid "role"');

    return new User(data);
  }
}
