import Device from '../../../domain/device/Device';
import DeviceFlag from '../../../domain/device/DeviceFlag';
import IDeviceRepository from '../../../domain/device/IDeviceRepository';
import IHashDriver from '../../../infra/drivers/hash/IHashDriver';
import ILoggerDriver from '../../../infra/drivers/logger/ILoggerDriver';
import BaseError from '../../errors/BaseError';
import InternalServerError from '../../errors/InternalServerError';
import IUseCase from '../IUseCase';

type DeviceData = {
  title: string;
  ip: string;
  latitude?: string;
  longitude?: string;
  platform: string;
  model: string;
};

type Input = {
  userId: string;
  device: DeviceData;
};

type Output = Device | BaseError;

export default class CreateDevice implements IUseCase<Input, Output> {
  constructor(
    private loggerDriver: ILoggerDriver,
    private hashDriver: IHashDriver,
    private deviceRepository: IDeviceRepository,
  ) {}

  async exec(input: Input): Promise<Output> {
    const { userId, device: deviceData } = input;
    const device = Device.create({
      deviceId: this.hashDriver.generateID(),
      userId,
      flag: DeviceFlag.BLUE,
      isLogged: false,
      ...deviceData,
    });

    if (device instanceof Error) {
      this.loggerDriver.debug({
        message: '[CreateDevice] Unable to create Device entity',
        input,
        error: device,
      });

      return new InternalServerError(device.message);
    }

    await this.deviceRepository.create(device);

    return device;
  }
}
