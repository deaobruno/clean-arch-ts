import Device from '../../../domain/device/Device';
import IDeviceRepository from '../../../domain/device/IDeviceRepository';
import ILoggerDriver from '../../../infra/drivers/logger/ILoggerDriver';
import IUseCase from '../IUseCase';

type Output = Device | undefined;

export default class FindDeviceById implements IUseCase<string, Output> {
  constructor(
    private loggerDriver: ILoggerDriver,
    private deviceRepository: IDeviceRepository,
  ) {}

  async exec(deviceId: string): Promise<Output> {
    const device = await this.deviceRepository.findOneById(deviceId);

    if (!device)
      this.loggerDriver.debug({
        message: `[FindDeviceById] Device not found: ${deviceId}`,
      });

    this.loggerDriver.debug({
      message: `[FindDeviceById] Device found`,
      device,
    });

    return device;
  }
}
