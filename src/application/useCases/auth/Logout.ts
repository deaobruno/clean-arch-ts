import IRefreshTokenRepository from '../../../domain/refreshToken/IRefreshTokenRepository';
import BaseError from '../../errors/BaseError';
import IUseCase from '../IUseCase';
import RefreshToken from '../../../domain/refreshToken/RefreshToken';
import ILoggerDriver from '../../../infra/drivers/logger/ILoggerDriver';
import IDeviceRepository from '../../../domain/device/IDeviceRepository';
import InternalServerError from '../../errors/InternalServerError';
import UpdateDevice from '../device/UpdateDevice';

type Input = {
  refreshToken: RefreshToken;
};

type Output = void | BaseError;

export default class Logout implements IUseCase<Input, Output> {
  constructor(
    private loggerDriver: ILoggerDriver,
    private refreshTokenRepository: IRefreshTokenRepository,
    private deviceRepository: IDeviceRepository,
    private updateDevice: UpdateDevice,
  ) {}

  async exec(input: Input): Promise<Output> {
    const { refreshToken } = input;
    const { deviceId, userId } = refreshToken;
    const device = await this.deviceRepository.findOneById(deviceId);

    if (!device || device.userId !== userId) {
      const message = `[Logout] Device not found`;

      this.loggerDriver.debug({
        message,
        input,
        userId,
        deviceId,
      });

      return new InternalServerError(message);
    }

    await this.refreshTokenRepository.deleteOne(refreshToken);

    device.isLogged = false;

    await this.updateDevice.exec(device);

    this.loggerDriver.debug({
      message: '[Logout] User logged out',
      input,
      userId,
      refreshToken,
    });
  }
}
