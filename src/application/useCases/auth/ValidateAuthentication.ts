import User from '../../../domain/user/User';
import IRefreshTokenRepository from '../../../domain/refreshToken/IRefreshTokenRepository';
import ITokenDriver from '../../../infra/drivers/token/ITokenDriver';
import BaseError from '../../errors/BaseError';
import IUseCase from '../IUseCase';
import UnauthorizedError from '../../errors/UnauthorizedError';
import IUserRepository from '../../../domain/user/IUserRepository';
import RefreshToken from '../../../domain/refreshToken/RefreshToken';
import ForbiddenError from '../../errors/ForbiddenError';
import ILoggerDriver from '../../../infra/drivers/logger/ILoggerDriver';
import IDeviceRepository from '../../../domain/device/IDeviceRepository';

type Input = {
  authorization?: string;
};

type Response = {
  user: User;
  refreshToken: RefreshToken;
};

type Output = Response | BaseError;

export default class ValidateAuthentication implements IUseCase<Input, Output> {
  constructor(
    private loggerDriver: ILoggerDriver,
    private tokenDriver: ITokenDriver,
    private refreshTokenRepository: IRefreshTokenRepository,
    private userRepository: IUserRepository,
    private deviceRepository: IDeviceRepository,
  ) {}

  async exec(input: Input): Promise<Output> {
    const { authorization } = input;

    if (!authorization) {
      const message = '[ValidateAuthentication] No token provided';

      this.loggerDriver.debug({
        message,
        input,
      });

      return new UnauthorizedError(message);
    }

    const [type, token] = authorization.split(' ');

    if (type !== 'Bearer') {
      const message = `[ValidateAuthentication] Invalid authentication type: ${type}`;

      this.loggerDriver.debug({
        message,
        input,
      });

      return new UnauthorizedError(message);
    }

    if (!token) {
      const message = '[ValidateAuthentication] No token provided';

      this.loggerDriver.debug({
        message,
        input,
      });

      return new UnauthorizedError(message);
    }

    let userData;

    try {
      userData = this.tokenDriver.validateAccessToken(token);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      const message =
        error.name === 'TokenExpiredError'
          ? `[ValidateAuthentication] Access token expired: ${token}`
          : `[ValidateAuthentication] Invalid access token: ${token}`;

      this.loggerDriver.debug({
        message,
        input,
        error,
      });

      return new ForbiddenError(message);
    }

    const { id: userId, deviceId } = userData;
    const user = await this.userRepository.findOneById(userId);

    if (!user) {
      const message = `[ValidateAuthentication] User not found: ${userId}`;

      this.loggerDriver.debug({
        message,
        input,
        userId,
      });

      return new ForbiddenError(message);
    }

    const device = await this.deviceRepository.findOneById(deviceId);

    if (!device) {
      const message = `[ValidateAuthentication] Device not found: ${deviceId}`;

      this.loggerDriver.debug({
        message,
        input,
        userId,
        deviceId,
      });

      return new ForbiddenError(message);
    }

    const refreshToken =
      await this.refreshTokenRepository.findOneByUserIdAndDeviceId(
        userId,
        deviceId,
      );

    if (!refreshToken) {
      const message = '[ValidateAuthentication] Refresh token not found';

      this.loggerDriver.debug({
        message,
        input,
        userId,
      });

      return new UnauthorizedError(message);
    }

    this.loggerDriver.debug({
      message: '[ValidateAuthentication] Successful authentication',
      input,
      userId,
      refreshToken,
    });

    return { user, refreshToken };
  }
}
