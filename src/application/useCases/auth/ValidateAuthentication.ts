import User from '../../../domain/user/User';
import IRefreshTokenRepository from '../../../domain/refreshToken/IRefreshTokenRepository';
import ITokenDriver from '../../../infra/drivers/token/ITokenDriver';
import BaseError from '../../errors/BaseError';
import IUseCase from '../IUseCase';
import UnauthorizedError from '../../errors/UnauthorizedError';
import IUserRepository from '../../../domain/user/IUserRepository';
import NotFoundError from '../../errors/NotFoundError';
import RefreshToken from '../../../domain/refreshToken/RefreshToken';
import ForbiddenError from '../../errors/ForbiddenError';

type Input = {
  authorization?: string;
};

type Output =
  | {
      user: User;
      refreshToken: RefreshToken;
    }
  | BaseError;

export default class ValidateAuthentication implements IUseCase<Input, Output> {
  constructor(
    private _tokenDriver: ITokenDriver,
    private _refreshTokenRepository: IRefreshTokenRepository,
    private _userRepository: IUserRepository,
  ) {}

  async exec(input: Input): Promise<Output> {
    const { authorization } = input;

    if (!authorization) return new UnauthorizedError('No token provided');

    const [type, token] = authorization.split(' ');

    if (type !== 'Bearer')
      return new UnauthorizedError('Invalid authentication type');

    if (!token) return new UnauthorizedError('No token provided');

    let userData;

    try {
      userData = this._tokenDriver.validateAccessToken(token);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      if (error.name === 'TokenExpiredError')
        return new UnauthorizedError('Token expired');

      return new UnauthorizedError('Invalid token');
    }

    const { id: userId } = userData;
    const refreshToken =
      await this._refreshTokenRepository.findOneByUserId(userId);

    if (!refreshToken) return new UnauthorizedError();

    const user = await this._userRepository.findOneById(userId);

    if (!user) return new NotFoundError('User not found');

    if (userId !== refreshToken.userId)
      return new ForbiddenError('Token does not belong to user');

    return { user, refreshToken };
  }
}
