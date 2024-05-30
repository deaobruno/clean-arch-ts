import Device from '../../domain/device/Device';
import DeviceMapper from '../../domain/device/DeviceMapper';
import IDbDevice from '../../domain/device/IDbDevice';
import IDeviceRepository from '../../domain/device/IDeviceRepository';
import User from '../../domain/user/User';
import ICacheDriver from '../../infra/drivers/cache/ICacheDriver';
import IDbDriver from '../../infra/drivers/db/IDbDriver';
import ILoggerDriver from '../../infra/drivers/logger/ILoggerDriver';

export default class DeviceRepository implements IDeviceRepository {
  constructor(
    private source: string,
    private logger: ILoggerDriver,
    private db: IDbDriver<IDbDevice>,
    private cache: ICacheDriver,
    private mapper: DeviceMapper,
  ) {}

  async create(device: Device): Promise<void> {
    const dbDevice = this.mapper.entityToDb(device);

    await this.db.create(this.source, dbDevice);

    this.logger.debug({
      message: '[DeviceRepository/create] Device created',
      device,
      dbDevice,
    });
  }

  async find(filters?: object | undefined, options = {}): Promise<Device[]> {
    const dbDevice = await this.db.find(this.source, filters, options);
    const devices = dbDevice.map(
      (device) => <Device>this.mapper.dbToEntity(device),
    );
    const message =
      devices.length > 0
        ? '[DeviceRepository/find] Device(s) found'
        : '[DeviceRepository/find] Devices not found';

    this.logger.debug({
      message,
      filters,
      options,
      dbDevice,
      devices,
    });

    return devices;
  }

  async findByUserId(user_id: string, options = {}): Promise<Device[]> {
    return this.find({ user_id }, options);
  }

  async findOne(filters: object): Promise<Device | undefined> {
    const dbDevice = await this.db.findOne(this.source, filters);

    if (!dbDevice) {
      this.logger.debug({
        message: '[DeviceRepository/findOne] Device not found',
        filters,
      });

      return;
    }

    const device = <Device>this.mapper.dbToEntity(dbDevice);

    this.logger.debug({
      message: '[DeviceRepository/findOne] Device found',
      filters,
      dbDevice,
      device,
    });

    return device;
  }

  async findOneById(device_id: string): Promise<Device | undefined> {
    // const cachedDevice = <Device>await this.cache.get(device_id);

    // if (cachedDevice) return cachedDevice;

    const device = await this.findOne({ device_id });

    // if (device) await this.cache.set(device_id, device);

    return device;
  }

  async update(device: Device): Promise<void> {
    const { deviceId: device_id, userId } = device;
    const dbDevice = this.mapper.entityToDb(device);

    await this.db.update(this.source, dbDevice, {
      device_id,
    });

    await this.cache.del(`device-${userId}`);

    this.logger.debug({
      message: '[DeviceRepository/update] Device updated',
      device,
      dbDevice,
    });
  }

  async deleteOne(device: Device): Promise<void> {
    const { userId, deviceId } = device;

    await this.db.delete(this.source, { deviceId });
    await this.cache.del(`device-${userId}`);

    this.logger.debug({
      message: '[DeviceRepository/delete] Device deleted',
      device,
    });
  }

  async deleteAllByUser(user: User): Promise<void> {
    const { userId: user_id } = user;

    await this.db.deleteMany(this.source, { user_id });
    await this.cache.del(`device-${user_id}`);

    this.logger.debug({
      message: '[DeviceRepository/deleteAllByUser] Devices deleted',
      userId: user_id,
    });
  }
}
