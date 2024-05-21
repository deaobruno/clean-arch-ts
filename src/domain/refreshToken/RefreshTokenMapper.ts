import ILoggerDriver from '../../infra/drivers/logger/ILoggerDriver';
import IMapper from '../IMapper';
import IDbRefreshToken from './IDbRefreshToken';
import RefreshToken from './RefreshToken';

export default class RefreshTokenMapper
  implements IMapper<RefreshToken, IDbRefreshToken>
{
  constructor(private logger: ILoggerDriver) {}

  entityToDb(refreshToken: RefreshToken): IDbRefreshToken {
    const { userId, token } = refreshToken;
    const dbRefreshToken = {
      user_id: userId,
      token,
    };

    this.logger.debug({
      message:
        '[RefreshTokenMapper/entityToDb] Refresh Token entity mapped to db data',
      refreshToken,
      dbRefreshToken,
    });

    return dbRefreshToken;
  }

  dbToEntity(dbRefreshToken: IDbRefreshToken): RefreshToken | Error {
    const { user_id, token } = dbRefreshToken;
    const refreshToken = RefreshToken.create({
      userId: user_id,
      token,
    });

    this.logger.debug({
      message:
        '[RefreshTokenMapper/entityToDb] Refresh Token db data mapped to entity',
      dbRefreshToken,
      refreshToken,
    });

    return refreshToken;
  }
}
