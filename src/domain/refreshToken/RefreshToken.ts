import IRefreshTokenData from './IRefreshTokenData';

export default class RefreshToken {
  readonly userId: string;
  readonly deviceId: string;
  readonly token: string;

  private constructor(data: IRefreshTokenData) {
    const { userId, deviceId, token } = data;

    this.userId = userId;
    this.deviceId = deviceId;
    this.token = token;
  }

  static create(data: IRefreshTokenData): RefreshToken | Error {
    const { userId, deviceId, token } = data;
    const uuidRegex =
      /^[0-9a-f]{8}\b-[0-9a-f]{4}\b-[0-9a-f]{4}\b-[0-9a-f]{4}\b-[0-9a-f]{12}$/i;

    if (!userId) return Error('[RefreshToken] "userId" required');

    if (!uuidRegex.test(userId))
      return Error('[RefreshToken] Invalid "userId"');

    if (!deviceId) return Error('[RefreshToken] "deviceId" required');

    if (!uuidRegex.test(deviceId))
      return Error('[RefreshToken] Invalid "deviceId"');

    if (!token) return Error('[RefreshToken] "token" required');

    return new RefreshToken(data);
  }
}
