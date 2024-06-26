import IRefreshTokenData from './IRefreshTokenData';

export default class RefreshToken {
  readonly userId: string;
  readonly token: string;

  private constructor(params: IRefreshTokenData) {
    const { userId, token } = params;

    this.userId = userId;
    this.token = token;
  }

  static create(params: IRefreshTokenData): RefreshToken | Error {
    const { userId, token } = params;
    const uuidRegex =
      /^[0-9a-f]{8}\b-[0-9a-f]{4}\b-[0-9a-f]{4}\b-[0-9a-f]{4}\b-[0-9a-f]{12}$/i;

    if (!userId) return new Error('[RefreshToken] "userId" required');

    if (!uuidRegex.test(userId))
      return new Error('[RefreshToken] Invalid "userId"');

    if (!token) return new Error('[RefreshToken] "token" required');

    return new RefreshToken(params);
  }
}
