import Device from '../../../domain/device/Device';
import BaseError from '../../errors/BaseError';
import UnauthorizedError from '../../errors/UnauthorizedError';
import IUseCase from '../IUseCase';
import ILoggerDriver from '../../../infra/drivers/logger/ILoggerDriver';

type Input = {
  userId: string;
  device: Device;
};

type Output = void | BaseError;

export default class ValidateDevice implements IUseCase<Input, Output> {
  constructor(private loggerDriver: ILoggerDriver) {}

  async exec(input: Input): Promise<Output> {
    const { userId, device } = input;
    const { deviceId } = device;

    if (device.userId !== userId) {
      const message = `[ValidateDevice] Device does not belong to user: ${deviceId}`;

      this.loggerDriver.debug({
        message,
        input,
        device,
      });

      return new UnauthorizedError(message);
    }

    if (device.isFlagged)
      this.loggerDriver.warn(`[ValidateDevice] Flagged device: ${deviceId}`);

    if (device.isBlocked) {
      const message = `[ValidateDevice] Blocked device: ${deviceId}`;

      this.loggerDriver.debug({
        message,
        input,
        device,
      });

      return new UnauthorizedError(message);
    }
  }
}
