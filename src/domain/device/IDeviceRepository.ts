import User from '../user/User';
import Device from './Device';

export default interface IDeviceRepository {
  create(device: Device): Promise<void>;
  find(filters?: object, options?: object): Promise<Device[]>;
  findByUserId(user_id: string, options?: object): Promise<Device[]>;
  findOne(filters: object): Promise<Device | undefined>;
  findOneById(device_id: string): Promise<Device | undefined>;
  update(device: Device, filters?: object): Promise<void>;
  deleteOne(device: Device): Promise<void>;
  deleteAllByUser(user: User): Promise<void>;
}
