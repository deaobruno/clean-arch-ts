import Device from '../../../domain/device/Device';
import IDeviceRepository from '../../../domain/device/IDeviceRepository';
import ILoggerDriver from '../../../infra/drivers/logger/ILoggerDriver';
import IUseCase from '../IUseCase';

export default class UpdateDevice implements IUseCase<Device, void> {
  constructor(
    private loggerDriver: ILoggerDriver,
    private deviceRepository: IDeviceRepository,
  ) {}

  async exec(device: Device): Promise<void> {
    await this.deviceRepository.update(device);

    this.loggerDriver.debug({
      message: '[UpdateDevice] Device updated',
      device,
    });
  }
}
