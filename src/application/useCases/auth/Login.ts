import IUseCase from '../IUseCase';
import ILoggerDriver from '../../../infra/drivers/logger/ILoggerDriver';
import IEncryptionDriver from '../../../infra/drivers/encryption/IEncryptionDriver';
import FindUserByEmail from '../user/FindUserByEmail';
import BaseError from '../../errors/BaseError';
import UnauthorizedError from '../../errors/UnauthorizedError';
import ValidateDevice from '../device/ValidateDevice';
import UpdateDevice from '../device/UpdateDevice';
import GenerateTokens from '../token/GenerateTokens';
import Device from '../../../domain/device/Device';
import BadRequestError from '../../errors/BadRequestError';
import FindDeviceById from '../device/FindDeviceById';
import CreateDevice from '../device/CreateDevice';

type DeviceData = {
  title: string;
  ip: string;
  latitude?: string;
  longitude?: string;
  platform: string;
  model: string;
};

type Input = {
  email: string;
  password: string;
  device_id?: string;
  device?: DeviceData;
};

type Response = {
  accessToken: string;
  refreshToken: string;
  deviceId: string;
};

type Output = Response | BaseError;

export default class Login implements IUseCase<Input, Output> {
  constructor(
    private loggerDriver: ILoggerDriver,
    private encryptionDriver: IEncryptionDriver,
    private findUserByEmail: FindUserByEmail,
    private generateTokens: GenerateTokens,
    private findDeviceById: FindDeviceById,
    private createDevice: CreateDevice,
    private validateDevice: ValidateDevice,
    private updateDevice: UpdateDevice,
  ) {}

  async exec(input: Input): Promise<Output> {
    const { email, password, device_id, device: requestDevice } = input;
    const user = await this.findUserByEmail.exec(email);

    if (
      !user ||
      !(await this.encryptionDriver.compare(password, user.password))
    ) {
      this.loggerDriver.debug({
        message: '[Login] Authentication failed',
        input,
        user,
      });

      return new UnauthorizedError();
    }

    const { userId } = user;
    let device: Device | undefined;

    if (device_id) device = await this.findDeviceById.exec(device_id);

    if (!device && requestDevice) {
      const newDevice = await this.createDevice.exec({
        userId,
        device: requestDevice,
      });

      if (newDevice instanceof BaseError) return newDevice;

      device = newDevice;
    }

    if (!device) {
      const message = '[Login] device_id or device data must be provided';

      this.loggerDriver.debug({
        message,
        input,
      });

      return new BadRequestError(message);
    }

    const deviceValidation = await this.validateDevice.exec({
      userId,
      device,
    });

    if (deviceValidation instanceof BaseError) return deviceValidation;

    const { deviceId } = device;
    const tokens = await this.generateTokens.exec({ userId, deviceId });

    if (tokens instanceof BaseError) return tokens;

    const { accessToken, refreshToken } = tokens;

    device.isLogged = true;
    device.lastLogin = new Date().toISOString();

    if (device_id && requestDevice) {
      device.latitude = requestDevice?.latitude;
      device.longitude = requestDevice?.longitude;
    }

    await this.updateDevice.exec(device);

    this.loggerDriver.debug({
      message: '[Login] User logged in',
      input,
      userId,
      accessToken,
      refreshToken,
    });

    return {
      accessToken,
      refreshToken,
      deviceId,
    };
  }
}
