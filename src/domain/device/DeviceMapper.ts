import ILoggerDriver from '../../infra/drivers/logger/ILoggerDriver';
import IMapper from '../IMapper';
import Device from './Device';
import IDbDevice from './IDbDevice';

export default class DeviceMapper implements IMapper<Device, IDbDevice> {
  constructor(private logger: ILoggerDriver) {}

  entityToDb(device: Device): IDbDevice {
    const {
      deviceId,
      userId,
      title,
      ip,
      platform,
      model,
      latitude,
      longitude,
      isLogged,
      flag,
      lastLogin,
    } = device;
    const dbDevice = {
      device_id: deviceId,
      user_id: userId,
      title,
      ip,
      platform,
      model,
      latitude,
      longitude,
      is_logged: isLogged,
      flag,
      last_login: lastLogin,
    };

    this.logger.debug({
      message: '[DeviceMapper/entityToDb] Device entity mapped to db data',
      device,
      dbDevice,
    });

    return dbDevice;
  }

  dbToEntity(dbDevice: IDbDevice): Device | Error {
    const {
      device_id,
      user_id,
      title,
      ip,
      platform,
      model,
      latitude,
      longitude,
      is_logged,
      flag,
      last_login,
    } = dbDevice;
    const device = Device.create({
      deviceId: device_id,
      userId: user_id,
      title,
      ip,
      platform,
      model,
      latitude,
      longitude,
      isLogged: is_logged,
      flag,
      lastLogin: last_login,
    });

    this.logger.debug({
      message: '[DeviceMapper/entityToDb] Device db data mapped to entity',
      dbDevice,
      device,
    });

    return device;
  }
}
