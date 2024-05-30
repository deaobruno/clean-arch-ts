import DeviceFlag from './DeviceFlag';
import IDeviceData from './IDeviceData';

export default class Device {
  readonly deviceId: string;
  readonly userId: string;
  readonly title: string;
  readonly ip: string;
  readonly platform: string;
  readonly model: string;
  latitude?: string;
  longitude?: string;
  isLogged: boolean;
  flag: DeviceFlag;
  lastLogin?: string;

  private constructor(data: IDeviceData) {
    const {
      deviceId,
      userId,
      title,
      ip,
      latitude,
      longitude,
      platform,
      model,
      isLogged,
      flag,
      lastLogin,
    } = data;

    this.deviceId = deviceId;
    this.userId = userId;
    this.title = title;
    this.ip = ip;
    this.latitude = latitude;
    this.longitude = longitude;
    this.platform = platform;
    this.model = model;
    this.isLogged = isLogged;
    this.flag = flag;
    this.lastLogin = lastLogin;
  }

  get isOk(): boolean {
    return this.flag === DeviceFlag.BLUE;
  }

  get isFlagged(): boolean {
    return this.flag === DeviceFlag.YELLOW;
  }

  get isBlocked(): boolean {
    return this.flag === DeviceFlag.RED;
  }

  static create(data: IDeviceData): Device | Error {
    const {
      deviceId,
      userId,
      title,
      ip,
      latitude,
      longitude,
      platform,
      model,
      isLogged = false,
      flag = DeviceFlag.RED,
      lastLogin,
    } = data;
    const uuidRegex =
      /^[0-9a-f]{8}\b-[0-9a-f]{4}\b-[0-9a-f]{4}\b-[0-9a-f]{4}\b-[0-9a-f]{12}$/i;
    const ipRegex = /^((25[0-5]|(2[0-4]|1\d|[1-9]|)\d)\.?\b){4}$/;
    const latitudeRegex = /^[-+]?([1-8]?\d(\.\d+)?|90(\.0+)?)$/;
    const longitudeRegex =
      /^\s*[-+]?(180(\.0+)?|((1[0-7]\d)|([1-9]?\d))(\.\d+)?)$/;
    const dateRegex =
      /\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d\.\d+([+-][0-2]\d:[0-5]\d|Z)/;

    if (!deviceId) return Error('[Device] "deviceId" required');

    if (!uuidRegex.test(deviceId)) return Error('[Device] Invalid "deviceId"');

    if (!userId) return Error('[Device] "userId" required');

    if (title.length > 50) return Error('[Device] "title" too long');

    if (!uuidRegex.test(userId)) return Error('[Device] Invalid "userId"');

    if (!ip) return Error('[Device] "ip" required');

    if (!ipRegex.test(ip)) return Error('[Device] Invalid "ip"');

    if (latitude && !latitudeRegex.test(latitude))
      return Error('[Device] Invalid "latitude"');

    if (longitude && !longitudeRegex.test(longitude))
      return Error('[Device] Invalid "longitude"');

    if (platform.length > 10) return Error('[Device] "platform" too long');

    if (model.length > 25) return Error('[Device] "model" too long');

    if (typeof isLogged !== 'boolean')
      return Error('[Device] Invalid isLogged');

    if (!Object.values(DeviceFlag).includes(flag))
      return Error('[Device] Invalid "flag"');

    if (lastLogin && !dateRegex.test(lastLogin))
      return Error('[Device] Invalid "lastLogin"');

    return new Device(data);
  }
}
